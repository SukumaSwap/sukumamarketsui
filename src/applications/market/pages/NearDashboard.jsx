import { useEffect, useState } from 'react'
import { Carousel } from '@mantine/carousel'
import { ActionIcon, Avatar, Box, Center, Grid, Group, Paper, Stack, Text, Title, Transition } from '@mantine/core'
import { useHover } from '@mantine/hooks'
import { IconCoin, IconCoinBitcoin } from '@tabler/icons'
import { CONTRACT, NEAR_OBJECT } from '../../../app/appconfig'
import { convertNstoTime, getTheme } from '../../../app/appFunctions'
import { getReadableTokenBalance, getTokenDetails, getTokenPrice, getUSD, makeTokens } from '../../../app/nearutils'

const AssetBalance = ({ asset, balance }) => {
    const { ref, hovered } = useHover()

    const [tokenDetails, setTokenDetails] = useState(null)
    const [tokenPrice, setTokenPrice] = useState(null)

    const loadDetails = () => {
        if (asset === "near") {
            setTokenDetails(NEAR_OBJECT)
        }
        else {
            getTokenMetadata()
        }
    }

    const getTokenMetadata = () => {
        const wallet = window.walletConnection
        if (wallet) {
            wallet.account().viewFunction(asset, "ft_metadata", {}, "3000000000000000").then(res => {
                setTokenDetails(res)
            }).catch(err => {
                // console.log(err)
            })
        }
    }

    const getPrice = () => {
        if (asset === "near") {
            getTokenPrice("wrap.testnet").then(res => {
                setTokenPrice(res?.price)
            }).catch(err => {
                console.log("Token price error", err)
            })
        }
        else {
            getTokenPrice(asset).then(res => {
                setTokenPrice(res?.price)
            }).catch(err => {
                console.log("Token price error", err)
            })
        }
    }

    useEffect(() => {
        loadDetails()
        getPrice()
    }, [])

    return (
        <Paper ref={ref} p="sm" radius="md" shadow="lg" sx={theme => ({
            background: theme.colorScheme === "dark"
                ? theme.fn.linearGradient(45, theme.colors.dark[7], theme.colors.dark[4])
                : theme.fn.linearGradient(45, theme.colors.gray[1], theme.colors.gray[0]),
            height: "130px",
            overflow: "hidden",
            '& .more-details': {
                display: 'none',
                overflow: "hidden"
            },
            '&:hover': {
                cursor: 'pointer',
                background: theme.fn.linearGradient(45, theme.colors.green[1], theme.colors.green[3]),
                boxShadow: 'rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px !important',
                '& .view-details': {
                    display: "none",
                    overflow: "hidden"
                },
                '& .more-details': {
                    display: 'block',
                }
            },
        })}>
            <Center className='view-details'>
                <Stack spacing={16} align="center" >
                    <Avatar src={tokenDetails?.icon} />
                    <Text>
                        {getReadableTokenBalance(balance, tokenDetails?.decimals || 0)}
                        &nbsp;
                        {tokenDetails?.symbol}
                    </Text>
                </Stack>
            </Center>
            <Center className='more-details'>
                <Stack spacing={0} align="center" >
                    <Avatar src={tokenDetails?.icon} />
                    <Text color="dark">
                        {tokenDetails?.name}
                    </Text>
                    <Box p="0" sx={theme => ({
                        background: theme.colors.gray[2],
                        borderRadius: theme.radius.sm,
                        padding: '0px 4px !important',
                        color: "dark"
                    })}>
                        <Text color="dark" style={{ padding: '0px !important' }}>
                            ${tokenPrice}
                        </Text>
                    </Box>
                    <Text color="dark">${getUSD(tokenPrice, getReadableTokenBalance(balance, tokenDetails?.decimals || 0))}</Text>
                </Stack>
            </Center>
        </Paper>
    )
}

const AccountStat = ({ title, value }) => {
    return (
        <Grid.Col xs={6} sm={4} md={3}>
            <Paper py="md" px="xl" radius="md" sx={theme => ({
                background: getTheme(theme) ? theme.colors.dark[6] : theme.colors.gray[2]
            })}>
                <Stack align="center" spacing={4}>
                    <Text>{title}</Text>
                    <Title order={5} color="green">{value}</Title>
                </Stack>
            </Paper>
        </Grid.Col>
    )
}

const NearDashboard = () => {

    const [acc, setAcc] = useState(null)

    const loadAccount = () => {
        const contract = window.contract
        const wallet = window.walletConnection
        if (contract && wallet && wallet.getAccountId()) {
            wallet.account().viewFunction(CONTRACT, "acc_private_info", { "account_id": wallet.getAccountId() }).then(res => {
                setAcc(res)
            }).catch(err => {
                console.log("Fetching offers error", err)
            })
        }
    }

    useEffect(() => {
        loadAccount()
    }, [])

    console.log(acc)

    return (
        <div>
            <section>
                <Title order={2} mb="md">Token Balances</Title>
                <Paper px="md" py="lg" radius="md" sx={theme => ({
                    background: theme.fn.linearGradient(45, theme.colors.green[1], theme.colors.green[3], theme.colors.green[1])
                })}>

                    <Carousel slideSize="30%" align="start" py="lg" slideGap="xl">
                        <Carousel.Slide>
                            <AssetBalance asset="near" balance={acc?.balance} />
                        </Carousel.Slide>
                        {
                            makeTokens(acc?.tokens).map((token, i) => (
                                <Carousel.Slide key={`token_Balancedd_${i}`}>
                                    <AssetBalance asset={token?.tokenId} balance={token?.balance} />
                                </Carousel.Slide>
                            ))
                        }
                    </Carousel>

                </Paper>
            </section>
            <section>
                <Title order={2} my="md">Account Statistics</Title>
                <Grid>
                    <AccountStat title="Trades" value={acc?.info?.trades} />
                    <AccountStat title="Transfers" value={acc?.info?.transfers} />
                    <AccountStat title="Offers" value={acc?.info?.offers} />
                    <AccountStat title="Active Offers" value={acc?.info?.offers} />
                    <AccountStat title="Partners" value={acc?.info?.trades} />
                    <AccountStat title="Positive Feedback" value={acc?.info?.likes} />
                    <AccountStat title="Negative Feedback" value={acc?.info?.dislikes} />
                    <AccountStat title="Blocked By" value={acc?.info?.blocked_by} />
                    <AccountStat title="Wallet Age (years)" value={convertNstoTime(acc?.info?.created_on, true)} />
                </Grid>
            </section>
        </div>
    )
}

export default NearDashboard