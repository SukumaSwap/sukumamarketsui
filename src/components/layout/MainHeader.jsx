import React, {useState, useEffect} from 'react'
import { Burger,Group, Header, MediaQuery, Title, useMantineTheme } from '@mantine/core'
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { IconSocial } from '@tabler/icons';
import { AccountDrawer, NetworkDrawer, ThemeSwitcher } from '../common/ThemeSwitcher';
import AccountButton, { ConnectWalletButton, SmConnectWalletButton } from '../../components/common/AccountButton';
import CustomNavbarLink from '../../components/common/CustomNavbarLink';
import NetworkSwitcher from '../../components/common/NetworkSwitcher';
import {getTheme} from '../../app/appFunctions';

import { selectNetwork } from '../../features/app/appSlice';

const navbarlinks = [
    {
        label: "Buy",
        to: "buy",
        disabled: false,
        icon: <IconSocial size={18} />,
        description: null,
    },
    {
        label: "Sell",
        to: "sell",
        disabled: false,
        icon: <IconSocial size={18} />,
        description: null,
    },
    {
        label: "Swap",
        to: "swap",
        disabled: true,
        icon: <IconSocial size={18} />,
        description: null,
    },
]

const MainHeader = () => {
    const [logged_in, setLogged_in] = useState(window.walletConnection.isSignedIn())
    const theme = useMantineTheme();
    const [opened, setOpened] = useState(false);
    const network = useSelector(selectNetwork)


    useEffect(() => {
        setLogged_in(window.walletConnection.isSignedIn())
    }, [window.walletConnection])
    return (
        <Header height={60} p="md" fixed>
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
                    <Link to="/" style={{ color: getTheme(theme) ? theme.colors.gray[1] : theme.colors.dark[7], textDecoration: "none" }}>
                        <Title order={2}> Sukuma </Title>
                    </Link>
                </Group>

                <MediaQuery smallerThan="md" styles={{ display: 'none !important' }}>
                    <Group>
                        {
                            navbarlinks.map((link, i) => (
                                <CustomNavbarLink key={`sidebar_link__nav_other_${i}`} url_prefix={network?.network_id} obj={link} />
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
                            <Group>import {useSelector} from 'react-redux';


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
    )
}

export default MainHeader