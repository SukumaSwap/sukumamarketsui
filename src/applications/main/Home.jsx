import { Box, Anchor, Avatar, Burger, Center, Container, Grid, Group, Header, MediaQuery, Paper, Stack, Text, Title, Transition, useMantineTheme } from '@mantine/core'
import { useState, useEffect } from 'react'
import CustomNavLink from '../../components/common/CustomNavlink';
import { IconAsset, IconBrandGithub, IconCurrencyDollar, IconExchange, IconHeartHandshake, IconHome, IconHomeDollar, IconNetwork, IconSocial, IconSwitchHorizontal, IconUsers, IconWallpaper } from '@tabler/icons'
import CustomNavbarLink from '../../components/common/CustomNavbarLink';
import NetworkSwitcher from '../../components/common/NetworkSwitcher';
import AccountButton, { ConnectWalletButton, SmConnectWalletButton } from '../../components/common/AccountButton';
import { AccountDrawer, NetworkDrawer, ThemeSwitcher } from '../../components/common/ThemeSwitcher';
import { Link, useNavigate } from 'react-router-dom';
import { useHover } from '@mantine/hooks';
import { getTheme } from '../../app/appFunctions';
import { Carousel } from '@mantine/carousel';
import { NETWORKS } from '../../app/appconfig';

const navbarlinks = [
    {
        label: "Buy",
        to: "./market/buy",
        disabled: false,
        icon: <IconSocial size={18} />,
        description: null,
    },
    {
        label: "Sell",
        to: "./market/sell",
        disabled: false,
        icon: <IconSocial size={18} />,
        description: null,
    },
    {
        label: "Swap",
        to: "./market/swap",
        disabled: true,
        icon: <IconSocial size={18} />,
        description: null,
    },
]

const solutions = [
    {
        title: <Group spacing="lg">
            <Text>Defi</Text>
            <IconSwitchHorizontal size={32} />
            <Text>Fiat</Text>
        </Group>,
        desc: "Any currency for every available crypto asset. Trade with no boundaries, send and receive through multiple payment methods."
    },
    {
        title: "Any defi asset you choose",
        desc: "List any liquid defi asset of your choosing. Tap into markets that didn't exist before"
    },
    {
        title: "Lock your value for an asset",
        desc: "No more loses from deprecating prices. Opt to lock in the value of your listed asset."
    },
    {
        title: "Cross-chain, between networks",
        desc: "Connect multiple chains without bridging on any asset."
    },
]

const stats = [
    {
        title: "Traders",
        value: 2000,
        icon: <IconUsers size={36} />
    },
    {
        title: "Networks",
        value: 2000,
        icon: <IconNetwork size={36} />
    },
    {
        title: "Assets",
        value: 2000,
        icon: <IconAsset size={36} />
    },
    {
        title: "Trades",
        value: 2000,
        icon: <IconHeartHandshake size={36} />
    },
    {
        title: "Total value locked",
        value: 2000,
        icon: <IconHomeDollar size={36} />
    },
    {
        title: "Last 30 Days Revenue",
        value: 2000,
        icon: <IconCurrencyDollar size={36} />
    },
]


const SolutionCard = ({ obj }) => {
    const { hovered, ref } = useHover();

    return (
        <Paper ref={ref} sx={theme => ({
            height: "250px",
            overflow: 'hidden',
            cursor: "pointer",
            ".desc": {
                display: "none",
            },
            ":hover": {
                ".title": {
                    display: "none",
                },
                ".desc": {
                    display: "block"
                }
            }
        })} radius="lg">
            <Center className='h-100'>
                <Transition mounted={!hovered} transition="slide-down" duration={400} timingFunction="ease">
                    {(styles) => <div style={styles}>
                        <Title order={3} className="title" align='center' px="md">
                            {obj?.title}
                        </Title>
                    </div>}
                </Transition>
                <div className="desc">
                    <Transition mounted={hovered} transition="slide-up" duration={400} timingFunction="ease">
                        {(styles) => <div style={styles}>
                            <Text align='center' p="lg">
                                {obj?.desc}
                            </Text>
                        </div>}
                    </Transition>
                </div>
            </Center>
        </Paper>
    )
}

const StatCard = ({ obj }) => {
    const { hovered, ref } = useHover();

    return (
        <Paper ref={ref} sx={theme => ({
            height: "250px",
            overflow: 'hidden',
            cursor: "pointer",
            background: getTheme(theme) ? theme.colors.dark[5] : theme.colors.gray[2]
        })} radius="lg">
            <Center className='h-100'>
                <Stack spacing={0}>
                    <Group position='center'>
                        <Avatar size={62} style={{ borderRadius: "50%" }}>
                            {obj?.icon}
                        </Avatar>
                    </Group>
                    <Title order={3} className="title" align='center' px="md">
                        {obj?.title}
                    </Title>
                    <div className="desc">
                        <Text align='center' p="lg">
                            {obj?.value}
                        </Text>
                    </div>
                </Stack>
            </Center>
        </Paper>
    )
}

const MoreCard = ({ obj }) => {

    return (
        <Paper radius="lg" style={{ height: "200px" }} sx={theme => ({
            background: getTheme(theme) ? theme.colors.dark[5] : theme.colors.gray[2],
            borderWidth: "2px",
            borderStyle: "solid",
            borderColor: getTheme(theme) ? theme.colors.gray[5] : theme.colors.dark[1],

            ".icon": {
                // padding: "10px",
                borderRadius: theme.radius.md,
                border: `2px solid ${getTheme(theme) ? theme.colors.gray[5] : theme.colors.dark[2]}`
            }
        })}>
            <Center className='h-100'>
                <Group position="center" style={{ alignItems: "center" }}>
                    <Anchor href={obj?.url}>
                        <Title align='center' weight={400}>
                            {obj?.title}
                        </Title>
                    </Anchor>
                    <span className='icn'>
                        {obj?.icon}
                    </span>

                </Group>
            </Center>
        </Paper>
    )
}

const Home = () => {
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
        <div>
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
            <div style={{ height: "calc(100vh)" }}>
                <Center className='h-100'>
                    <Stack>
                        <Title align='center'>
                            FIRST GLOBAL MARKETPLACE FOR <span>WEB3</span>
                        </Title>
                        <Title align='center' order={3}>
                            A peer to peer decentralized platform for your digital assets.
                        </Title>
                        <Center>
                            <ConnectWalletButton />
                        </Center>
                    </Stack>
                </Center>
            </div>
            <Container size="lg" my="xl">
                <Paper p="xl" radius="lg" sx={theme => ({
                    background: 'linear-gradient(to right, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)), url(./../../assets/bg.jpeg) no-repeat',
                    backgroundSize: "cover"
                })}>
                    <Title order={2}>Solutions we provide</Title>
                    <Grid my="xl">
                        {
                            solutions?.map((obj, i) => (
                                <Grid.Col key={`solution_${i}`} md={3}>
                                    <SolutionCard obj={obj} />
                                </Grid.Col>
                            ))
                        }
                    </Grid>
                </Paper>
            </Container>

            <Box py="xl" sx={theme => ({
                background: getTheme(theme) ? theme.colors.dark[5] : theme.colors.gray[2]
            })}>
                <Container size="lg" style={{ padding: "30px 0" }}>
                    <Title order={2} mt="xl" mb="xl">Networks</Title>
                    <Carousel slideSize="20%" slideGap={30} align="start">
                        {
                            NETWORKS?.map((network, i) => (
                                <Carousel.Slide key={`${i}`}>
                                    <Paper radius="lg" sx={theme => ({
                                        height: "150px",
                                        background: getTheme(theme) ? theme.colors.dark[5] : theme.colors.gray[0],
                                    })}>
                                        <Center className='h-100'>
                                            <Group px="xl">
                                                <Stack spacing={10}>
                                                    <Avatar src={network?.icon} size={62} mx="auto" />
                                                    <Text align='center' size="xs">{!network.active && 'Coming soon'}</Text>
                                                    <Title order={4}>{network?.name}</Title>
                                                </Stack>
                                            </Group>
                                        </Center>
                                    </Paper>
                                </Carousel.Slide>
                            ))
                        }
                    </Carousel>
                </Container>
            </Box>
            <Container size="lg" my="xl">
                <Paper py="xl" radius="lg">
                    <Title order={2}>Market Statistics</Title>
                    <Grid my="xl">
                        {
                            stats?.map((obj, i) => (
                                <Grid.Col key={`solution_${i}`} md={3}>
                                    <StatCard obj={obj} />
                                </Grid.Col>
                            ))
                        }
                    </Grid>
                </Paper>
            </Container>
            <Box py="xl" sx={theme => ({
                background: getTheme(theme) ? theme.colors.dark[5] : theme.colors.gray[1]
            })}>
                <Container size="lg" my="xl">
                    <Paper p="xl" radius="lg">
                        <Title order={2}>Read More</Title>
                        <Grid my="xl">
                            <Grid.Col md={6}>
                                <MoreCard obj={{ title: "whitepaper", icon: <IconWallpaper size={42} color="green" />, url: "https://whitepaper.com" }} />
                            </Grid.Col>
                            <Grid.Col md={6}>
                                <MoreCard obj={{ title: "Github", icon: <IconBrandGithub size={42} color="green" />, url: "https://github.com" }} />
                            </Grid.Col>
                        </Grid>
                    </Paper>
                </Container>
            </Box>
        </div>
    )
}

export default Home
