import 'regenerator-runtime/runtime'

import {Title } from '@mantine/core';
import './App.css';
import { AppWrapper } from './components/layout/AppShell';
import { Outlet, Route, Routes } from 'react-router-dom';
import Home from './applications/main/Home';
import MarketWrapper from './applications/market/MarketWrapper';
import NearDashboard from './applications/market/pages/NearDashboard';
import Buy from './applications/market/pages/buy/Buy';
import UserAccount from './applications/market/pages/account/UserAccount';
import CreateBuyTrade from './applications/market/pages/buy/CreateBuyTrade';
import TradeChat from './applications/market/pages/chats/TradeChat';
import Trades from './applications/market/pages/trades/Trades';
import Transfers from './applications/market/pages/transfers/Transfers';
import Offers from './applications/market/pages/offers/Offers';
import TradeChats from './applications/market/pages/chats/TradeChats';
import CommunityWrapper from './applications/market/pages/community/CommunityWrapper';
import NoChatSelected from './components/common/NoChatSelected';
import CommunityChats from './applications/market/pages/community/chats/CommunityChats';
import SingleChat from './applications/market/pages/community/chats/SingleChat';
import SingleGroup from './applications/market/pages/community/groups/SingleGroup';
import CommunityForums from './applications/market/pages/community/forums/CommunityForums';
import CommunityGroups from './applications/market/pages/community/groups/CommunityGroups';
import SingleForum from './applications/market/pages/community/forums/SingleForum';
import CreateOffer from './applications/market/pages/offers/CreateOffer';
import { useEffect } from 'react';
import { showNotification } from '@mantine/notifications';
import Sell from './applications/market/pages/sell/Sell';
import CreateTokenBuyTrade from './applications/market/pages/buy/CreateTokenBuyTrade';
import TokenChat from './applications/market/pages/chats/TokenChat';

import {
  getDefaultWallets,
  lightTheme,
  RainbowKitProvider,
} from "@rainbow-me/rainbowkit";
import { chain, configureChains, createClient, WagmiConfig } from "wagmi";
import { publicProvider } from "wagmi/providers/public";

const MainHome = () => {

  return (
    <>
      <Outlet />
    </>
  )
}

function App() {
  //wagmi accounts
    //configure chains
  const { chains, provider } = configureChains(
    [chain.mainnet, chain.polygon, chain.arbitrum],
    [publicProvider()]
  );

//connector
  const { connectors } = getDefaultWallets({
    appName: "Connect Wallet",
    chains,
  });
//creATE WAGMI CLIENT
  const wagmiClient = createClient({
    autoConnect: true,
    connectors,
    provider,
  });

  //un comment this to connect Near protocal
  // const createAccount = () => {
  //   // Function called whenever market url is called once, to make sure the user has a registered account.
  //   const contract = window.contract
  //   const wallet = window.walletConnection

  //   if (contract && wallet && contract.register_new_account) {
  //     contract.register_new_account({ account_id: wallet.getAccountId() }).then(res => {
  //       if (res.trim() === "Account registered successfully".trim()) {
  //         showNotification({
  //           title: "Account Registration",
  //           message: "Account registered successfully",
  //           color: "green.9",
  //         })
  //         // getSukumaAccount()
  //       }
  //       else if (res.trim() === "Account already registered".trim()) {
  //         showNotification({
  //           title: "Account Registration",
  //           message: "Account already registered",
  //           color: "blue.9",
  //         })
  //         // getSukumaAccount()
  //       }
  //     }).catch(err => {
  //       console.log("error", err)
  //       // showNotification({
  //       //   title: "Error",
  //       //   message: "Account registration failed",
  //       //   color: "red.7",
  //       // })
  //     })
  //   }
  // }

  useEffect(() => {
    // createAccount()
  }, [])

  return (
    <AppWrapper>
      <Routes>
      <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider
        chains={chains}
        theme={lightTheme({
          overlayBlur: "small",
        })}
      >
        <ReceiptProvider>
          <Component {...pageProps} />
          <Toaster
            position="top-center"
            reverseOrder={false}
            toastOptions={{
              style: {
                overflow: "hidden",
                maxWidth: "100%",
                width: "fit-content",
              },
            }}
          />
        </ReceiptProvider>
      </RainbowKitProvider>
    </WagmiConfig>
    
        <Route path='/' element={<MainHome />} >
          <Route path='/' element={<Home />} />
          <Route path='/market/' element={<MarketWrapper />} >
            <Route path='' element={<NearDashboard />} />

            <Route path="buy" element={<Buy />} />
            <Route path="buy/create-buy-trade/:offer_id/" element={<CreateBuyTrade />} />
            <Route path="buy/create-buy-trade/asset/:offer_id/" element={<CreateTokenBuyTrade />} />

            <Route path="sell" element={<Sell />} />
            <Route path="sell/create-sell-trade/:offer_id/" element={<CreateSellTrade />} />
            <Route path="sell/create-sell-trade/asset/:offer_id/" element={<CreateTokenSellTrade />} />

            <Route path="chats/:chat_id/" element={<TradeChat />} />
            <Route path="chats/token/:chat_id/" element={<TokenChat />} />

            <Route path="accounts/:account_id" element={<UserAccount />} />

            <Route path="trades/" element={<TradeChats />} />
            <Route path="transfers/" element={<Transfers />} />
            <Route path="offers/" element={<Offers />} />
            <Route path="offers/new/" element={<CreateOffer />} />
            {/* <Route path="trade-chats/" element={<TradeChats />} /> */}

            <Route path="community/" element={<CommunityWrapper />}>
              <Route path='chats' element={<CommunityChats />} >
                <Route path="" element={<NoChatSelected title="No Chat Selected" msg="Please select a chat to continue" />} />
                <Route path=':single' element={<SingleChat />} />
                <Route path="*"  element={<Title order={4}>Chat not found</Title>} />
              </Route>
              <Route path='forums' element={<CommunityForums />} >
                <Route path="" element={<NoChatSelected title="No Forum Selected" msg="Please select a forum to continue" />} />
                <Route path=':single' element={<SingleForum />} />
                <Route path="*"  element={<Title order={4}>Forum not found</Title>} />
              </Route>
              <Route path='groups' element={<CommunityGroups />} >
                <Route path="" element={<NoChatSelected title="No Group Selected" msg="Please select a group to continue" />} />
                <Route path=':single' element={<SingleGroup />} />
                <Route path="*"  element={<Title order={4}>Group not found</Title>} />
              </Route>
              <Route path="*"  element={<Title order={4}>Community chat not found</Title>} />
            </Route>


          
            <Route path="*" element={<Title order={4}>Page not found</Title>} />
          </Route>
        </Route>
      </Routes>
    </AppWrapper>
  );
}

export default App;
