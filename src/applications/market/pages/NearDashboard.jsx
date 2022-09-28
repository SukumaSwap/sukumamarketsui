import { Carousel } from '@mantine/carousel'
import { ActionIcon, Box, Center, Grid, Group, Paper, Stack, Text, Title, Transition } from '@mantine/core'
import { useHover } from '@mantine/hooks'
import { IconCoin, IconCoinBitcoin } from '@tabler/icons'
import React from 'react'
import { getTheme } from '../../../app/appFunctions'

const AssetBalance = () => {
    const {ref, hovered} = useHover()
    return (
        <Paper ref={ref} p="sm" radius="md" shadow="lg" sx={theme => ({
            background: theme.colorScheme === "dark"
                ? theme.fn.linearGradient(45, theme.colors.dark[7], theme.colors.dark[4])
                : theme.fn.linearGradient(45, theme.colors.gray[1], theme.colors.gray[0]),
            height: "130px",
            '& .more-details': {
                display: 'none'
            },
            '&:hover': {
                cursor: 'pointer',
                background: theme.fn.linearGradient(45, theme.colors.green[1], theme.colors.green[3]),
                boxShadow: 'rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px !important',
                '& .view-details': {
                    display: "none"
                },
                '& .more-details': {
                    display: 'block'
                }
            },
        })}>
            <Transition mounted={true} transition="fade" duration={400} timingFunction="ease">
                {(styles) =>
                    <Center className='view-details'>
                        <Stack spacing={16} align="center" >
                            <ActionIcon size={42} radius="xl" sx={theme => ({
                                background: "white",
                                color: "black"
                            })}>
                                <IconCoinBitcoin size={36} />
                            </ActionIcon>
                            <Text>0.113 BTC</Text>
                        </Stack>
                    </Center>
                }
            </Transition>
            <Transition mounted={true} transition="fade" duration={400} timingFunction="ease">
                {(styles) =>
                    <Center className='more-details'>
                        <Stack spacing={0} align="center" >
                            <ActionIcon size={32} radius="xl" sx={theme => ({
                                background: "transparent",
                                color: "black !important"
                            })}>
                                <IconCoinBitcoin size={36} />
                            </ActionIcon>
                            <Text color="dark">Bitcoin</Text>
                            <Box p="0" sx={theme => ({
                                background: theme.colors.gray[2],
                                borderRadius: theme.radius.sm,
                                padding: '0px 4px !important',
                                color: "dark"
                            })}>
                                <Text color="dark" style={{ padding: '0px !important' }}>
                                    $121212.21
                                </Text>
                            </Box>
                            <Text color="dark">0.113 BTC - more USD</Text>
                        </Stack>
                    </Center>
                }
            </Transition>
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
    return (
        <div>
            <section>
                <Title order={2} mb="md">Token Balances</Title>
                <Paper px="md" py="lg" radius="md" sx={theme => ({
                    background: theme.fn.linearGradient(45, theme.colors.green[1], theme.colors.green[3], theme.colors.green[1])
                })}>

                    <Carousel slideSize="30%" align="start" py="lg" slideGap="xl">
                        <Carousel.Slide>
                            <AssetBalance />
                        </Carousel.Slide>
                        <Carousel.Slide>
                            <AssetBalance />
                        </Carousel.Slide>
                    </Carousel>

                </Paper>
            </section>
            <section>
                <Title order={2} my="md">Account Statistics</Title>
                <Grid>
                    <AccountStat title="Trades" value="12" />
                    <AccountStat title="Transfers" value="54" />
                    <AccountStat title="Offers" value="34" />
                    <AccountStat title="Active Offers" value="32" />
                    <AccountStat title="Partners" value="56" />
                    <AccountStat title="Positive Feedback" value="234" />
                    <AccountStat title="Negative Feedback" value="43" />
                    <AccountStat title="Blocked By" value="4" />
                    <AccountStat title="Wallet Age (years)" value="0.1" />
                </Grid>
            </section>
        </div>
    )
}

export default NearDashboard