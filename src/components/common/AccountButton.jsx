import {
  Menu,
  Button,
  Text,
  Group,
  CopyButton,
  ActionIcon,
} from "@mantine/core";
import {
  IconCopyright,
  IconCopy,
  IconUser,
  IconLogout,
  IconLogin,
} from "@tabler/icons";
import { getTextCount, getTheme } from "../../app/appFunctions";
import { login, logout } from "../../app/near/utils";
import { useSelector } from "react-redux";
import { selectNetwork } from "../../features/app/appSlice";
import { showNotification } from "@mantine/notifications";
import { useMantineTheme } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { ConnectButton } from "@rainbow-me/rainbowkit";
function ConnectWalletButton() {
  const network = useSelector(selectNetwork);
  const dologin = () => {
    if (network?.network_id === "near") {
      login();
      return;
    } else {
      showNotification({
        message: "Network has not been fully configured.",
        color: "yellow",
      });
    }
  };

  return (
    <>
      {network.network_id === "near" ? (
        <Button
          radius="xl"
          style={{
            height: "42px",
            padding: "0 30px",
          }}
          color="violet"
          onClick={dologin}
        >
          Connect Wallet
        </Button>
      ) : (
        <>
        <ConnectButton/>
        </>
      )}
    </>
  );
}

function SmConnectWalletButton() {
  const theme = useMantineTheme();
  const network = useSelector(selectNetwork);
  const dologin = () => {
    if (network?.network_id === "near") {
      login();
      return;
    } else {
      showNotification({
        message: "Network has not been fully configured.",
        color: "yellow",
      });
    }
  };
  return (
    <ActionIcon
      variant="filled"
      color={getTheme(theme) ? "violet" : "blue"}
      onClick={dologin}
      title="Open Network Drawer"
      radius="md"
    >
      <IconLogin />
    </ActionIcon>
  );
}

function AccountButton() {
  let acc = window.walletConnection.getAccountId();
  const navigate = useNavigate();
  const goTo = (url) => {
    navigate(url);
  };
  return (
    <Menu shadow="md" width={230} radius="lg">
      <Menu.Target>
        <Button
          radius="xl"
          style={{
            height: "42px",
            padding: "0 30px",
          }}
          color="violet"
        >
          <Group>
            <Text>{getTextCount(acc || "", 13)}</Text>
            <CopyButton value={acc || ""}>
              {({ copied, copy }) => (
                <div color={copied ? "teal" : "blue"} onClick={copy}>
                  {copied ? <IconCopyright /> : <IconCopy />}
                </div>
              )}
            </CopyButton>
          </Group>
        </Button>
      </Menu.Target>

      <Menu.Dropdown px="md" py="xl">
        <Menu.Item
          sx={(theme) => ({
            background:
              theme.colorScheme === "dark"
                ? theme.colors.dark[4]
                : theme.colors.gray[1],
            borderRadius: theme.radius.md,
            height: 50,
          })}
          px="xl"
          mb="xs"
          onClick={(e) => goTo("/near")}
        >
          <Group position="center">
            <IconUser />
            <Text>Profile</Text>
          </Group>
        </Menu.Item>
        <Menu.Item
          sx={(theme) => ({
            background:
              theme.colorScheme === "dark"
                ? theme.colors.dark[4]
                : theme.colors.gray[1],
            borderRadius: theme.radius.md,
            height: 50,
          })}
          px="xl"
          mb="xs"
          onClick={logout}
        >
          <Group position="center">
            <Text>Logout</Text>
            <IconLogout />
          </Group>
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}

export default AccountButton;
export { ConnectWalletButton, SmConnectWalletButton };
