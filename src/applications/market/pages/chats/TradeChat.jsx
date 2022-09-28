import React from 'react'
import { Paper, Grid, Title, Center, Stack, Avatar, Text, Group, ScrollArea, Button, ActionIcon } from '@mantine/core';
import { getTextCount, getTheme, greenGradientBg } from '../../../../app/appFunctions';
import { IconThumbDown, IconThumbUp, IconUser, IconLink, IconSend, IconMoodSmile, IconCamera, IconCheck, IconX } from '@tabler/icons';
import { useNavigate } from 'react-router-dom';
import ChatBody from '../../../../components/common/ChatBody';
import { LeftMessage, RightMessage } from '../../../../components/common/ChatMessagesDisplay';

const instructions = `Hi there,\n 1. Say hi.\n2. Drop your details. \n3. I will send the money via the payment method I specified.\n4. I mark Trade as paid.\n5. You mark Trade as received. \n6. We rate each other positively. \n7. Deal DONE!`

const OfferDetail = ({ obj }) => {
    return (
        <Grid>
            <Grid.Col md={6}>
                <Text>{obj.title}</Text>
            </Grid.Col>
            <Grid.Col md={6}>
                <Text align={obj.alignment}>{obj.value}</Text>
            </Grid.Col>
        </Grid>
    )
}

const CustomActionButton = ({ obj, action }) => {
    return (
        <Button sx={theme => ({
            borderRadius: theme.radius.xl,
            background: theme.colors.gray[1],
            color: theme.colors.violet,
            height: "42px",
            ":hover": {
                color: theme.colors.gray[1],
                background: theme.colors.violet,
            }
        })} rightIcon={obj.icon}>
            {obj.title}
        </Button>
    )
}


// #3cc8c800
const TradeChat = () => {

    const navigate = useNavigate()

    const startChat = () => {
        navigate("/market/chats/chat_id")
    }

    return (
        <>
            {/* <GoBackButton /> */}
            <Paper px="xs" py="sm" radius="md" sx={theme => ({
                height: "90.9vh",
            })}>
                <Grid className='h-100' my="0">
                    <Grid.Col md={5} py="0" className='h-100'>
                        <ScrollArea className='h-100'>
                            <Paper px="md">
                                <section>
                                    <Paper py="md" radius="md" sx={theme => ({
                                        backgroundImage: "linear-gradient(19deg,#21d4fd,#b721ff)",
                                    })}>
                                        <Center>
                                            <Group>
                                                <CustomActionButton obj={{
                                                    title: "Mark as paid",
                                                    icon: <IconCheck />
                                                }} action="" />
                                                <CustomActionButton obj={{
                                                    title: "Cancel",
                                                    icon: <IconX />
                                                }} action="" />
                                            </Group>
                                        </Center>
                                    </Paper>
                                </section>
                                <section>
                                    <Paper mt="md" px="md" py="xs" radius="md" sx={theme => ({
                                        background: greenGradientBg(theme)
                                    })}>
                                        <Title order={2} color="dark">Seller Details</Title>
                                        <Grid my="sm">
                                            <Grid.Col xs={12} sm={6}>
                                                <Center style={{
                                                    height: "100%"
                                                }}>
                                                    <Stack>
                                                        <Avatar />
                                                        <Text size="sm" color="green">Online</Text>
                                                    </Stack>
                                                </Center>
                                            </Grid.Col>
                                            <Grid.Col xs={12} sm={6}>
                                                <Center style={{
                                                    height: "100%"
                                                }}>
                                                    <Stack>
                                                        <Title order={4} color="dark" weight={700} align='center'>
                                                            {getTextCount("dalmasonto.testnet", 18)}
                                                        </Title>
                                                        <Group align="center" position='center'>
                                                            <Group >
                                                                <IconThumbUp color='green' />
                                                                <Text color="dark">102</Text>
                                                            </Group>
                                                            <Group >
                                                                <IconThumbDown color='red' />
                                                                <Text color="dark">102</Text>
                                                            </Group>
                                                        </Group>
                                                        <Text color="dark" align='center'>
                                                            Trades: 20
                                                        </Text>
                                                    </Stack>
                                                </Center>
                                            </Grid.Col>

                                        </Grid>
                                    </Paper>
                                </section>
                                <section>
                                    <Paper p="xs" radius="md" my="md" sx={theme => ({
                                        border: getTheme(theme) ? `1px solid ${theme.colors.gray[6]}` : `1px solid ${theme.colors.gray[4]}`
                                    })}>
                                        <Title order={3}>Trade Instructions</Title>
                                        <Text style={{
                                            whiteSpace: "pre-line"
                                        }}>
                                            {instructions}
                                        </Text>
                                    </Paper>
                                </section>
                                <section>
                                    <Paper p="xs" radius="md" my="md" sx={theme => ({
                                        background: getTheme(theme) ? theme.colors.dark[4] : theme.colors.gray[2]
                                    })}>
                                        <Title order={3}>Offer Details</Title>
                                        <Paper p="xs" radius="md" my="sm" sx={theme => ({
                                            background: getTheme(theme) ? theme.colors.dark[8] : theme.colors.gray[5]
                                        })}>
                                            <Group position='apart'>
                                                <Group>
                                                    <Avatar />
                                                    <Stack spacing={0}>
                                                        <Text size="md">Near</Text>
                                                        <Text size="sm">NEAR</Text>
                                                    </Stack>
                                                </Group>
                                                <Text sx={theme => ({
                                                    background: getTheme(theme) ? theme.colors.dark[3] : theme.colors.gray[3],
                                                    borderRadius: theme.radius.sm,
                                                    padding: '2px 4px',
                                                })}>$ 552</Text>
                                            </Group>
                                        </Paper>
                                        <OfferDetail obj={{
                                            title: "Minimum Amount",
                                            value: "20",
                                            alignment: "end"
                                        }} />
                                        <OfferDetail obj={{
                                            title: "Maximum Amount",
                                            value: "20",
                                            alignment: "end"
                                        }} />
                                        <OfferDetail obj={{
                                            title: "Token Rate",
                                            value: "$4.323",
                                            alignment: "end"
                                        }} />
                                        <OfferDetail obj={{
                                            title: "Offer Rate",
                                            value: "-1%",
                                            alignment: "end"
                                        }} />
                                        <OfferDetail obj={{
                                            title: "Trade Outcome",
                                            value: `You are entering a trade in which you will sell at 1% to market price. 
                                            This means you will have a chance to gain in the trade.`,
                                            alignment: "start"
                                        }} />
                                    </Paper>
                                </section>
                            </Paper>
                        </ScrollArea>
                    </Grid.Col>
                    <Grid.Col md={7} py="0" className='h-100'>
                        <ChatBody>
                            <div className="chat-head">
                                <Group px="md">
                                    <IconUser size={42} />
                                    <Stack spacing="0">
                                        <Text>Rashid Abdalla</Text>
                                        <Text size="sm" color="green">online</Text>
                                    </Stack>
                                </Group>
                            </div>
                            <div className="chat-body">
                                <ScrollArea style={{
                                    height: "100%",
                                }}>
                                    <Paper px="sm" py="sm" style={{
                                        background: "transparent"
                                    }}>
                                        {/* Messages go here */}
                                        <LeftMessage obj={{ msg: "Hi there?" }} />
                                        <RightMessage obj={{ msg: "Hi" }} />
                                        <RightMessage obj={{ msg: "Kindly drop your details" }} />
                                        <LeftMessage obj={{ msg: "sending..." }} />
                                    </Paper>
                                </ScrollArea>
                            </div>
                            <div className="chat-footer">
                                <Paper p="xs" sx={theme => ({
                                    // background: theme.colors.gray[4],
                                    background: getTheme(theme) ? theme.colors.gray[4] : theme.colors.gray[2],
                                    width: "100%",
                                    borderRadius: theme.radius.xl,
                                    height: "100%",
                                    display: "flex",
                                    alignItems: "center"
                                })}>
                                    <Group style={{ width: "100%" }}>
                                        <ActionIcon radius="xl" size={32}>
                                            <IconLink color='black' />
                                        </ActionIcon>
                                        <input type="text" className='custom-input' placeholder='Type your message here ...' />
                                        <ActionIcon radius="xl" size={32}>
                                            <IconMoodSmile color='black' />
                                        </ActionIcon>
                                        <ActionIcon radius="xl" size={32}>
                                            <IconCamera color='black' />
                                        </ActionIcon>
                                        <ActionIcon radius="xl" size={32}>
                                            <IconSend color='black' />
                                        </ActionIcon>
                                    </Group>
                                </Paper>
                            </div>
                        </ChatBody>
                    </Grid.Col>
                </Grid>
            </Paper>
        </>
    )
}

export default TradeChat