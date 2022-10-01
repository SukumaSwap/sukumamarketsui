import { useState, useEffect } from 'react';
import {
  AppShell,
  Navbar,
  Header,
  MediaQuery,
  Burger,
  useMantineTheme,
  Title,
  Group,
  Button,
  Stack,
  Paper,
  Center,
  Avatar,
  Text,
  CopyButton,
  ActionIcon,
  Container,
  NavLink,
  ScrollArea,
  Aside,
} from '@mantine/core';
import { Outlet, useNavigate } from 'react-router-dom';
import { AccountDrawer, NetworkDrawer, ThemeSwitcher } from '../../components/common/ThemeSwitcher';
import CustomNavlink from '../../components/common/CustomNavlink';
import { IconCopy, IconCopyright, IconHome, IconMessage, IconSocial, IconWriting } from '@tabler/icons';
import NetworkSwitcher from '../../components/common/NetworkSwitcher';
import AccountButton, { ConnectWalletButton, SmConnectWalletButton } from '../../components/common/AccountButton';
import CustomNavbarLink from '../../components/common/CustomNavbarLink';
import DepositModal from './modals/DepositModal';
import WithdrawModal from './modals/WithdrawModal';
import CustomNavLink from '../../components/common/CustomNavlink';

const getUrl = (path) => {
  return `./${path}`
}


const dashboard_links = [
  {
    to: './',
    label: 'Dashboard',
    icon: <IconHome size={16} />,
    description: null,
  },
  {
    to: './offers',
    label: 'Offers',
    icon: <IconHome size={16} />,
    description: null,
  },
  {
    to: './trades',
    label: 'Trades',
    icon: <IconHome size={16} />,
    description: null,
  },
  {
    to: './transfers',
    label: 'Transfers',
    icon: <IconHome size={16} />,
    description: null,
  },
  // {
  //   to: './trade-chats',
  //   label: 'Trade Chats',
  //   icon: <IconMessage size={16} />,
  //   description: null,
  // },
  {
    to: './community/chats',
    label: 'Community',
    icon: <IconSocial size={18} />,
    description: null,
  },
]

const navbarlinks = [
  {
    label: "Buy",
    to: "./buy",
    disabled: false,
    icon: <IconSocial size={18} />,
    description: null,
  },
  {
    label: "Sell",
    to: "./sell",
    disabled: false,
    icon: <IconSocial size={18} />,
    description: null,
  },
  {
    label: "Swap",
    to: "./swap",
    disabled: true,
    icon: <IconSocial size={18} />,
    description: null,
  },
]

export default function MarketWrapper({ children }) {
  const [logged_in, setLogged_in] = useState(window.walletConnection.isSignedIn())
  const theme = useMantineTheme();
  const [opened, setOpened] = useState(false);
  const navigate = useNavigate()

  let acc = window.walletConnection.getAccountId()

  const openSidebar = (value) => {
    setOpened(value)
  }

  useEffect(() => {
    setLogged_in(window.walletConnection.isSignedIn())
  }, [window.walletConnection])
  return (
    <AppShell
      styles={{
        main: {
          // background: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0],
        },
      }}
      navbarOffsetBreakpoint="sm"
      asideOffsetBreakpoint="sm"
      navbar={
        <Navbar px="xs" pt="xs" hiddenBreakpoint="sm" hidden={!opened} width={{ xs: "80%", sm: 250, md: 300, lg: 300 }}>
          {/* <Text>Application navbar</Text> */}
          <MediaQuery smallerThan="sm" styles={{ display: 'none' }}>
            <Navbar.Section>
              <Paper px="md" py="sm" radius="md" sx={theme => ({
                background: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0],
              })}>
                <Center>
                  <Avatar size={44} radius="md" />
                </Center>
                <Center my="sm">
                  <Text style={{
                    maxWidth: '80%',
                    whiteSpace: 'nowrap !important',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis !important',
                  }}>{acc}</Text>
                  <CopyButton value={acc}>
                    {({ copied, copy }) => (
                      <ActionIcon color={copied ? 'teal' : 'blue'} onClick={copy}>
                        {copied ? <IconCopyright /> : <IconCopy />}
                      </ActionIcon>
                    )}
                  </CopyButton>
                </Center>
                <Center>
                  <Button rightIcon={<IconWriting />} style={{
                    height: '44px'
                  }} radius="xl" sx={theme => ({
                    color: theme.colors.violet[8],
                    background: theme.colors.gray[0],
                    '&:hover': {
                      background: 'transparent',
                      color: theme.colors.gray[3],
                      border: `1px solid white`
                    }
                  })}
                    onClick={e => navigate('./offers/new')}
                  >Create Offer</Button>
                </Center>
              </Paper>
            </Navbar.Section>
          </MediaQuery>
          <Navbar.Section grow py="md" px="sm" component={ScrollArea}>

            <MediaQuery largerThan="sm" styles={{ display: 'none' }}>
              <div>
                <CustomNavLink navlink={{
                  label: "Create Offer",
                  to: "./offers/new",
                  disabled: false,
                  icon: <IconSocial size={18} />,
                  description: null,
                }} openSidebar={openSidebar} />
                {
                  navbarlinks.map((link, i) => (
                    <CustomNavlink key={`sidebar_link__nav_${i}`} navlink={link} openSidebar={openSidebar} />
                  ))
                }
                <Text order={4} size="sm">ACCOUNT</Text>
              </div>
            </MediaQuery>
            {
              dashboard_links.map((link, i) => (
                <CustomNavlink key={`sidebar_link__${i}`} navlink={link} openSidebar={openSidebar} />
              ))
            }
          </Navbar.Section>
          <Navbar.Section py="sm">
            <Stack>
              <DepositModal />
              <WithdrawModal />
            </Stack>
          </Navbar.Section>
        </Navbar>
      }
      header={
        <Header height={60} p="md">
          <div style={{ display: 'flex', alignItems: 'center', height: '100%', justifyContent: "space-between" }}>
            <Group spacing={10}>
              <MediaQuery largerThan="sm" styles={{ display: 'none !important' }}>
                <Burger
                  opened={opened}
                  onClick={() => setOpened((o) => !o)}
                  size="sm"
                  color={theme.colors.gray[6]}
                />
              </MediaQuery>
              <Title order={2}> Sukuma </Title>
            </Group>

            <MediaQuery smallerThan="md" styles={{ display: 'none !important' }}>
              <Group>
                {
                  navbarlinks.map((link, i) => (
                    <CustomNavbarLink key={`sidebar_link__nav_other_${i}`} obj={link} />
                  ))
                }
              </Group>
            </MediaQuery>
            <Group>
              <MediaQuery smallerThan="md" styles={{ display: 'none !important' }}>
                <Group>
                  <NetworkSwitcher />
                  {
                      logged_in ? <AccountButton /> : <ConnectWalletButton />
                    }
                </Group>
              </MediaQuery>
              <Group p="0">
                <MediaQuery largerThan="sm" styles={{ display: 'none !important' }}>
                  <Group>
                    <NetworkDrawer />
                    {
                      logged_in ? <AccountDrawer /> : <SmConnectWalletButton />
                    }
                  </Group>
                </MediaQuery>
                <ThemeSwitcher />
              </Group>
            </Group>
          </div>
        </Header>
      }
      padding="0"
    >
      <Container size="xl" px="xs" py={0}>
        <Outlet />
      </Container>
    </AppShell>
  );
}