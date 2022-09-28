import { ActionIcon, Avatar, Button, Center, CopyButton, Drawer, Paper, ScrollArea, Text, Title, useMantineColorScheme } from '@mantine/core';
import { IconSun, IconMoonStars, IconLogin, IconLogout, IconUser, IconCopyright, IconCopy, IconWriting } from '@tabler/icons';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectTheme, setTheme, selectNetwork } from '../../features/app/appSlice';
import { useState } from 'react';
import { useMantineTheme } from '@mantine/core';
import { getTheme } from '../../app/appFunctions';
import { useNavigate } from 'react-router-dom';
import { DrawerNetwork } from './NetworkSwitcher';
import { NETWORKS } from '../../app/appconfig';

export function ThemeSwitcher() {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();

  const theme = useSelector(selectTheme)
  const dark = colorScheme === 'dark';

  const dispatch = useDispatch()

  useEffect(() => {
    toggleColorScheme(theme);
  }, [theme])

  return (
    <ActionIcon
      // variant="outline"
      variant='filled'
      color={dark ? 'orange' : 'blue'}
      onClick={() => {
        dispatch(setTheme(colorScheme === 'dark' ? 'light' : 'dark'));
      }}
      title="Toggle color scheme"
      radius="md"
      gradient={{
        from: 'yellow',
        to: 'orange',
        deg: 35
      }}
    >
      {dark ? <IconSun size={20} /> : <IconMoonStars size={20} />}
    </ActionIcon>
  );
}

export function LoginButton() {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const dark = colorScheme === 'dark';

  return (
    <ActionIcon
      variant="outline"
      color={dark ? 'blue' : 'blue'}
      onClick={() => toggleColorScheme()}
      title="Login"
      radius="md"
    >
      <IconLogin size={20} />
    </ActionIcon>
  );
}


export function LogoutButton() {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const dark = colorScheme === 'dark';

  return (
    <ActionIcon
      variant="outline"
      // variant='filled'
      color={dark ? 'blue' : 'blue'}
      onClick={() => toggleColorScheme()}
      title="Logout"
      radius="md"
    >
      <IconLogout size={20} />
    </ActionIcon>
  );
}

export function NetworkDrawer() {
  const [open, setOpen] = useState(false)
  const theme = useMantineTheme()
  const network = useSelector(selectNetwork)
  const close = () => {
    setOpen(false)
  }
  return (
    <>
      <ActionIcon
        variant='filled'
        color={getTheme(theme) ? 'violet' : 'blue'}
        onClick={() => setOpen(true)}
        title="Open Network Drawer"
        radius="md"
      >
        <Avatar size="sm" src={network?.icon} />
      </ActionIcon>
      <Drawer
        opened={open}
        overlayColor={theme.colorScheme === 'dark' ? theme.colors.dark[9] : theme.colors.gray[2]}
        // overlayOpacity={0.1}
        // overlayBlur={1}
        position="bottom"
        padding="md"
        size="xl"
        sx={theme => ({
          ".mantine-Drawer-drawer": {
            borderRadius: "30px 30px 0 0"
          }
        })}
        title={<Title order={3}>Network</Title>}
        onClose={e => setOpen(false)}
      >
        <ScrollArea style={{height: "450px"}}>
          <Paper p="sm">
          {
            NETWORKS?.map((network, index) => (
              <DrawerNetwork key={`__${network.network_id}_${index}`} close={close} network={network} />
            ))
          }
          </Paper>
        </ScrollArea>
      </Drawer>
    </>
  );
}

export function AccountDrawer() {
  const [open, setOpen] = useState(false)
  const theme = useMantineTheme()
  const navigate = useNavigate()

  return (
    <>
      <ActionIcon
        variant='filled'
        color={getTheme(theme) ? 'violet' : 'blue'}
        onClick={() => setOpen(true)}
        title="Open Network Drawer"
        radius="md"
      >
        <IconUser size={20} />
      </ActionIcon>
      <Drawer
        opened={open}
        overlayColor={theme.colorScheme === 'dark' ? theme.colors.dark[9] : theme.colors.gray[2]}
        // overlayOpacity={0.1}
        // overlayBlur={1}
        position="bottom"
        padding="md"
        size="lg"
        sx={theme => ({
          ".mantine-Drawer-drawer": {
            borderRadius: "30px 30px 0 0"
          }
        })}
        title={<Title order={3}>Account</Title>}
        onClose={e => setOpen(false)}
      >
        {/* Drawer content */}
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
            }}>dalmasonto.testnet</Text>
            <CopyButton value="dalmasonto.testnet">
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
      </Drawer>
    </>
  );
}