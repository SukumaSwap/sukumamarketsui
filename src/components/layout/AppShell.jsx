import { useState, useEffect } from "react";
import { MantineProvider, ColorSchemeProvider } from "@mantine/core";
import { BrowserRouter } from "react-router-dom";
import { NotificationsProvider } from "@mantine/notifications";
import { ModalsProvider } from "@mantine/modals";
import { useSelector } from "react-redux";
import { selectTheme } from "../../features/app/appSlice";

//wagmi imports
import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { chain, configureChains, createClient, WagmiConfig } from "wagmi";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";

//configs
const { chains, provider } = configureChains(
  [chain.mainnet, chain.polygon, chain.optimism, chain.arbitrum, chain.goerli],
  [alchemyProvider({ apiKey: process.env.ALCHEMY_ID }), publicProvider()]
);
//connectors
const { connectors } = getDefaultWallets({
  appName: "Sukuma Markets",
  chains,
});
// client : connector + provider
const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

export function AppWrapper({ children }) {

  const [colorScheme, setColorScheme] = useState("dark");
  const theme = useSelector(selectTheme);

  const toggleColorScheme = (value) => {
    setColorScheme(value);
  };

  useEffect(() => {
    setColorScheme(theme);
  }, [theme]);

  return (
    <BrowserRouter>
      <WagmiConfig client={wagmiClient}>
        <RainbowKitProvider chains={chains}>
          <ColorSchemeProvider
            colorScheme={colorScheme}
            toggleColorScheme={toggleColorScheme}
          >
            <MantineProvider
              theme={{ colorScheme, fontFamily: "Mukta" }}
              withGlobalStyles
              withNormalizeCSS
            >
              <ModalsProvider>
                <NotificationsProvider>{children}</NotificationsProvider>
              </ModalsProvider>
            </MantineProvider>
          </ColorSchemeProvider>
        </RainbowKitProvider>
      </WagmiConfig>
    </BrowserRouter>
  );
}
