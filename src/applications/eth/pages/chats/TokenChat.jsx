import React, { useEffect, useState, useRef } from 'react'
import { Paper, Grid, Title, Center, Stack, Avatar, Text, Group, ScrollArea, Button, ActionIcon, LoadingOverlay, Alert, Loader } from '@mantine/core';
import { getTextCount, getTheme, greenGradientBg } from '../../../../app/appFunctions';
import { IconThumbDown, IconThumbUp, IconUser, IconLink, IconSend, IconMoodSmile, IconCamera, IconCheck, IconX, IconAlertCircle, IconInfoCircle, IconStar, IconReportMoney } from '@tabler/icons';
import { useNavigate, useParams } from 'react-router-dom';
import ChatBody from '../../../../components/common/ChatBody';
import { LeftMessage, NotificationMsg, RightMessage } from '../../../../components/common/ChatMessagesDisplay';
import { CONTRACT } from '../../../../app/appconfig';
import { calcOfferRate, getReadableTokenBalance, getTokenPrice } from '../../../../app/nearutils';
import parse from 'html-react-parser';
import { showNotification } from '@mantine/notifications';

import { db, updateDoc, doc, onSnapshot, serverTimestamp, Timestamp } from '../../../../app/firebaseconfig';
import { useModals } from '@mantine/modals';
import { ConnectWalletButton } from '../../../../components/common/AccountButton';
import { getHotkeyHandler } from '@mantine/hooks';
import TokenPreview from '../../../../components/common/near/TokenPreview';
import { useMemo } from 'react';


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
        })} rightIcon={obj.icon} onClick={action}>
            {obj.title}
        </Button>
    )
}

const CustomDisabledButton = ({ title }) => {
    return (
        <Button sx={theme => ({
            borderRadius: theme.radius.xl,
            background: theme.colors.gray[1],
            color: theme.colors.violet,
            height: "42px",
            ":disabled": {
                color: theme.colors.gray[1],
                background: theme.colors.violet,
            }
        })} disabled>
            {title}
        </Button>
    )
}

const UserProfile = ({ offerDetails }) => {
    return (
        <Paper px="md" py="xs" radius="md" sx={theme => ({
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
                                {getTextCount(offerDetails?.offerer?.id || "", 18)}
                            </Title>
                            <Group align="center" position='center'>
                                <Group >
                                    <IconThumbUp color='green' />
                                    <Text color="dark">{offerDetails?.offerer?.likes}</Text>
                                </Group>
                                <Group >
                                    <IconThumbDown color='red' />
                                    <Text color="dark">{offerDetails?.offerer?.dislikes}</Text>
                                </Group>
                            </Group>
                            <Text color="dark" align='center'>
                                Trades: {offerDetails?.offerer?.trades}
                            </Text>
                        </Stack>
                    </Center>
                </Grid.Col>

            </Grid>
        </Paper>
    )
}

const CustomRatingSection = ({ children }) => {
    return (
        <Paper sx={theme => ({
            background: theme.colors.gray[2],
        })} my="md">
            {children}
        </Paper>
    )
}

const TradeAction = ({ obj }) => {
    return (
        <Alert my="sm" variant="filled" color="violet" sx={theme => ({
            background: 'rgb(4, 61, 4)',
        })}>
            <Group position='apart'>
                <Stack spacing={0}>
                    <Title order={4}>{obj?.title}</Title>
                    <Text>{obj?.msg}</Text>
                </Stack>
                {/* <IconCheck /> */}
                {obj?.icon}
            </Group>
        </Alert>
    )
}


const TokenChat = () => {

    const [chat, setChat] = useState(null)
    const [messages, setMessages] = useState([])
    const [firestoreChat, setFirestoreChat] = useState(null)

    const [offerDetails, setOfferDetails] = useState(null)

    const [tokenPrice, setTokenPrice] = useState(null)

    const [loading, setLoading] = useState(false)

    const { chat_id } = useParams()

    const msgInputRef = useRef(null)
    const scrollBottomRef = useRef(null)
    const chatBodyRef = useRef(null)

    const modals = useModals()

    const executeScroll = () => {
        if (chatBodyRef) {
            scrollBottomRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }

    const resetInput = () => {
        msgInputRef.current.value = ''
    }

    const loadTradeChat = () => {
        const wallet = window.walletConnection
        const contract = window.contract
        if (wallet && contract) {
            // wallet.account().viewFunction(CONTRACT, "pub_get_token_chat", { "chat_id": chat_id }).then(res => {
            //     setChat(res?.chat)
            //     setOfferDetails(res?.offer)
            // }).catch(err => {
            //     console.log("Fetching chat error", err)
            // })
            contract.pub_get_token_chat({ "chat_id": chat_id }).then(res => {
                setChat(res?.chat)
                setOfferDetails(res?.offer)
            }).catch(err => {
                console.log("Fetching chat error", err)
            })
        }
    }

    const getPrice = () => {
        getTokenPrice(chat?.offer_id).then(res => {
            setTokenPrice(res?.price)
        }).catch(err => {
            console.log("Token price error", err)
        })
    }

    const markaspaid = () => {
        const contract = window.contract
        if (contract && contract.mark_as_paid) {
            setLoading(true)
            contract.mark_token_as_paid({ chat_id: chat_id }).then(res => {
                // updateFirebase({ paid: true })
                fbSendMsg(`<b>${chat?.payer}</b> has marked the trade as paid`, { paid: true })
            }).catch(err => {
                console.log(err)
            }).finally(() => {
                setLoading(false)
            })
        }
    }

    const markasreceived = () => {
        const contract = window.contract
        const conn = window.walletConnection
        if (contract && conn && contract.mark_as_received) {
            setLoading(true)
            contract.mark_token_as_received({ chat_id: chat_id }, 300000000000000).then(res => {
                // updateFirebase({ received: true })
                fbSendMsg(`<b>${chat?.receiver}</b> has released the asset.`, { received: true, released: true })
                showNotification({
                    message: <Text weight={600}>Chat marked as received and tokens have been released.</Text>,
                    color: "green",
                    radius: "xl"
                })
            }).catch(err => {
                console.log(err)
                showNotification({
                    message: <Text weight={600}>Marking the chat as received failed.</Text>,
                    color: "red",
                    radius: "xl"
                })
            }).finally(() => {
                setLoading(false)
            })
        }
    }

    const receiverDoRate = (rating) => {
        const contract = window.contract
        const conn = window.walletConnection
        if (contract && conn && contract.receiver_rate_chat) {
            setLoading(true)
            contract.receiver_token_rate_chat({ chat_id: chat_id, rating: rating }).then(res => {
                // updateFirebase({ receiver_has_rated: true })
                fbSendMsg(`<b>${chat?.receiver}</b> has left a rating.`, { receiver_has_rated: true })
                showNotification({
                    message: <Text weight={600}>You have rated the other party.</Text>,
                    color: "green",
                    radius: "xl"
                })
            }).catch(err => {
                console.log(err)
                showNotification({
                    message: <Text weight={600}>Rating failed, please try again later</Text>,
                    color: "danger",
                    radius: "xl"
                })
            }).finally(() => {
                setLoading(false)
            })
        }
    }

    const payerDoRate = (rating) => {
        const contract = window.contract
        const conn = window.walletConnection
        if (contract && conn && contract.payer_rate_chat) {
            setLoading(true)
            contract.payer_token_rate_chat({ chat_id: chat_id, rating: rating }).then(res => {
                // updateFirebase({ payer_has_rated: true })
                fbSendMsg(`<b>${chat?.payer}</b> has left a rating.`, { payer_has_rated: true })

                showNotification({
                    message: <Text weight={600}>You have rated the other trader.</Text>,
                    color: "green",
                    radius: "xl"
                })
            }).catch(err => {
                showNotification({
                    message: <Text weight={600}>Rating failed, please try again later</Text>,
                    color: "green",
                    radius: "xl"
                })
            }).finally(() => {
                setLoading(false)
            })
        }
    }

    const cancelChat = () => {
        const contract = window.contract
        const conn = window.walletConnection
        if (contract && conn) {
            setLoading(true)
            contract.cancel_token_chat({ chat_id: chat_id }).then(res => {
                fbSendMsg(`<b>${window?.walletConnection?.getAccountId()}</b> has canceled the trade.`, { canceled: true })
            }).catch(err => {
                console.log(err)
            }).finally(() => {
                setLoading(false)
            })
        }
    }

    const fbSendMsg = (msg_, obj) => {
        const doc__ref = doc(db, `chatmsgs/${chat_id}`);
        let time = Timestamp.now()
        const msg = {
            sender: "system",
            msg: msg_,
            timestamp: time,
            type: "notify",
        }
        updateDoc(doc__ref, { messages: [...messages, msg], ...obj }).then(fulfilled => {
            // executeScroll()
        }).catch(err => {
            console.log(err)
        })
    }

    const sendMsg = () => {
        const doc__ref = doc(db, `chatmsgs/${chat_id}`);
        let time = Timestamp.now()
        const msg = {
            sender: window.walletConnection.getAccountId(),
            msg: msgInputRef.current.value,
            timestamp: time,
            type: "msg",
        }
        updateDoc(doc__ref, { messages: [...messages, msg] }).then(fulfilled => {
            // executeScroll()
        }).catch(err => {
            console.log(err)
        })
        resetInput()
    }

    const openConfirmReceiveModal = () => {

        return modals.openConfirmModal({
            title: <Title order={4}>Confirm Receive</Title>,
            children: (
                <>
                    <Text>Are you sure you have received the agreed sum amount?</Text>
                    <Text>If so, the locked asset will be released to the buyer instantly. </Text>
                    <Alert my="sm" icon={<IconAlertCircle size={16} />} color="indigo">
                        Once you confirm this action, there is no reverting back.
                    </Alert>
                </>
            ),
            labels: { cancel: "Cancel", confirm: "Confirm" },
            confirmProps: { color: "green", radius: "xl" },
            cancelProps: { color: "red", radius: "xl" },
            centered: true,
            radius: "xl",
            onConfirm: () => markasreceived(),
            onCancel: () => {
                showNotification({
                    message: <Text weight={600}>Action canceled</Text>,
                    color: "blue",
                    icon: <IconInfoCircle />,
                    radius: "xl",
                })
            },
        })

    }

    const firestoreUpdate = useMemo(() => {
        return {
            paid: firestoreChat?.paid,
            received: firestoreChat?.received,
            r_has_rated: firestoreChat?.receiver_has_rated,
            p_has_rated: firestoreChat?.payer_has_rated,
            canceled: firestoreChat?.canceled
        }
    }, [firestoreChat?.paid,
    firestoreChat?.received,
    firestoreChat?.receiver_has_rated,
    firestoreChat?.payer_has_rated,
    firestoreChat?.canceled])

    useEffect(() => {
        getPrice()
    }, [chat])

 
    // useEffect(() => {
    //     loadTradeChat()
    // }, [])

    useEffect(() => {
        loadTradeChat()
    }, [firestoreUpdate])

    useEffect(() => {
        const doc__ref = doc(db, `chatmsgs/${chat_id}`);
        const unsub = onSnapshot(doc__ref, doc => {
            doc.exists && doc.data() && doc.data().messages && setMessages(doc.data().messages)
            doc.exists && doc.data() && doc.data() && setFirestoreChat(doc.data())
            setTimeout(() => {
                executeScroll()
            }, 100)
        })
        return unsub;
    }, [])

    // console.log("message", firestoreChat)

    return (
        <>
            {/* <GoBackButton /> */}
            <Paper px="xs" py="sm" radius="md" sx={theme => ({
                height: "90.9vh",
            })}>
                <Grid className='h-100' my="0">

                    <Grid.Col md={5}>
                        <ScrollArea style={{
                            height: 'calc(100vh - 115px)',
                        }}>
                            <Paper px="md">
                                <section>
                                    <Paper py="md" mb="md" radius="md" sx={theme => ({
                                        backgroundImage: "linear-gradient(19deg,#21d4fd,#b721ff)",
                                    })}>
                                        <Center>
                                            <Group align="center" position="center">
                                                {
                                                    chat?.receiver === window?.walletConnection?.getAccountId() && (
                                                        <>
                                                            {
                                                                !chat?.received &&
                                                                <CustomActionButton obj={{
                                                                    title: "Release",
                                                                    icon: loading ? <Loader size={16} /> : <IconCheck size={16} />
                                                                }} action={openConfirmReceiveModal} />
                                                            }
                                                            {
                                                                chat?.received && <CustomDisabledButton title="Released" />
                                                            }
                                                        </>
                                                    )
                                                }
                                                {
                                                    chat?.payer === window?.walletConnection?.getAccountId() && (
                                                        <>
                                                            {
                                                                !chat?.paid &&
                                                                <CustomActionButton obj={{
                                                                    title: "Mark as paid",
                                                                    icon: loading ? <Loader size={16} /> : <IconCheck size={16} />
                                                                }} action={markaspaid} />
                                                            }
                                                            {
                                                                chat?.paid && <CustomDisabledButton title="Paid" />
                                                            }
                                                        </>
                                                    )
                                                }
                                                <CustomActionButton obj={{
                                                    title: "Cancel",
                                                    icon: loading ? <Loader size={16} /> : <IconX size={16} />
                                                }} action={cancelChat} />
                                            </Group>
                                        </Center>
                                    </Paper>
                                </section>
                                <section>
                                    <Title order={3} mb="sm">Trade Details</Title>
                                    {(chat?.paid || chat?.received) && (
                                        <CustomRatingSection>
                                            {
                                                chat?.payer === window?.walletConnection?.getAccountId() && (
                                                    <>
                                                        {
                                                            !chat?.payer_has_rated ? (
                                                                <>
                                                                    <Title align='center' pt="md" order={5} color="dark">What do you think about this trader?</Title>
                                                                    <Group mt="sm" pb="md" position='center'>
                                                                        <ActionIcon size={46} radius="xl" onClick={e => payerDoRate(true)}>
                                                                            <IconThumbUp size={32} color='green' />
                                                                        </ActionIcon>
                                                                        <ActionIcon size={46} radius="xl" onClick={e => payerDoRate(false)}>
                                                                            <IconThumbDown size={32} color='red' />
                                                                        </ActionIcon>
                                                                    </Group>
                                                                </>
                                                            ) : <Title order={5} align="center" py="xl" color="dark">Thank you for the review!</Title>
                                                        }
                                                    </>
                                                )
                                            }
                                            {
                                                chat?.receiver === window?.walletConnection?.getAccountId() && (
                                                    <>
                                                        {
                                                            !chat?.receiver_has_rated ? (
                                                                <>
                                                                    <Title align='center' pt="md" order={5} color="dark">What do you think about this trader?</Title>
                                                                    <Group mt="sm" pb="md" position='center'>
                                                                        <ActionIcon size={46} radius="xl" onClick={e => receiverDoRate(true)}>
                                                                            <IconThumbUp size={32} color='green' />
                                                                        </ActionIcon>
                                                                        <ActionIcon size={46} radius="xl" onClick={e => receiverDoRate(false)}>
                                                                            <IconThumbDown size={32} color='red' />
                                                                        </ActionIcon>
                                                                    </Group>
                                                                </>
                                                            ) : <Title order={5} align="center" py="xl" color="dark">Thank you for the review!</Title>
                                                        }
                                                    </>
                                                )
                                            }
                                        </CustomRatingSection>
                                    )
                                    }
                                    {chat?.paid &&
                                        <TradeAction obj={{ title: "Paying", icon: <IconSend />, msg: `${chat.payer} has marked the trade as paid.` }} />
                                    }
                                    {chat?.received &&
                                        <TradeAction obj={{ title: "Releasing", icon: <IconReportMoney />, msg: `${chat.receiver} has released the asset.` }} />
                                    }
                                    {chat?.payer_has_rated &&
                                        <TradeAction obj={{ title: "Rating", icon: <IconStar />, msg: `${chat.payer} has left a rating.` }} />
                                    }
                                    {chat?.receiver_has_rated &&
                                        <TradeAction obj={{ title: "Rating", icon: <IconStar />, msg: `${chat.receiver} has marked the trade as paid` }} />
                                    }
                                </section>
                                <section>
                                    <UserProfile offerDetails={offerDetails} />
                                </section>
                                <section>
                                    <Paper p="xs" radius="md" my="md" sx={theme => ({
                                        border: getTheme(theme) ? `1px solid ${theme.colors.gray[6]}` : `1px solid ${theme.colors.gray[4]}`
                                    })}>
                                        <Title order={3}>Trade Instructions</Title>
                                        <Text style={{
                                            whiteSpace: "pre-line"
                                        }}>
                                            {offerDetails?.instructions}
                                        </Text>
                                    </Paper>
                                </section>
                                <section>
                                    <Paper p="xs" radius="md" my="md" sx={theme => ({
                                        background: getTheme(theme) ? theme.colors.dark[4] : theme.colors.gray[2]
                                    })}>
                                        <Title order={3}>Offer Details</Title>

                                        <TokenPreview offerDetails={offerDetails} tokenPrice={tokenPrice} />
                                        
                                        <OfferDetail obj={{
                                            title: "Minimum Amount",
                                            value: getReadableTokenBalance(offerDetails?.min_amount, 24),
                                            alignment: "end"
                                        }} />
                                        <OfferDetail obj={{
                                            title: "Maximum Amount",
                                            value: getReadableTokenBalance(offerDetails?.max_amount, 24),
                                            alignment: "end"
                                        }} />
                                        <OfferDetail obj={{
                                            title: "Token Rate",
                                            value: <>${calcOfferRate(offerDetails?.offer_rate, tokenPrice)}</>,
                                            alignment: "end"
                                        }} />
                                        <OfferDetail obj={{
                                            title: "Offer Rate",
                                            value: offerDetails?.offer_rate,
                                            alignment: "end"
                                        }} />
                                        <OfferDetail obj={{
                                            title: "Currency",
                                            value: offerDetails?.currency,
                                            alignment: "end"
                                        }} />
                                        <OfferDetail obj={{
                                            title: "Payment Method",
                                            value: (<>
                                                <Group align="center" position='right'>
                                                    <img height="20px" src={offerDetails?.payment?.icon} alt={offerDetails?.payment?.name} />
                                                    <Text>{offerDetails?.payment?.name}</Text>
                                                </Group>
                                            </>),
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
                        <LoadingOverlay visible={loading} mx="xs" overlayBlur={.5} sx={theme => ({
                            borderRadius: theme.radius.xl,
                        })} />

                        <ChatBody>
                            <div className="chat-head">
                                <Group px="md">
                                    <IconUser size={42} />
                                    <Stack spacing="0">
                                        <Text>
                                            {
                                                chat?.receiver === window.walletConnection.getAccountId() ? chat?.payer : chat?.receiver
                                            }
                                        </Text>
                                        <Text size="sm" color="green">online</Text>
                                    </Stack>
                                </Group>
                            </div>
                            <div className="chat-body">
                                <ScrollArea style={{
                                    height: "100%",
                                    position: "relative"
                                }}>
                                    <Paper ref={chatBodyRef} px="sm" py="sm" style={{
                                        background: "transparent",
                                    }}>
                                        <NotificationMsg obj={{ msg: chat?.payment_msg }} />
                                        {/* Messages go here */}
                                        {
                                            !window?.walletConnection?.getAccountId() && <Title align='center' order={2}>Connect wallet to continue</Title>
                                        }
                                        {
                                            messages && window?.walletConnection?.getAccountId() && messages.map((msg, i) => {
                                                if (msg?.sender === window.walletConnection.getAccountId()) {
                                                    return <RightMessage key={`right_msg_${i}`} obj={msg} />
                                                }
                                                else if (msg?.type === "notify") {
                                                    return <NotificationMsg key={`left_msg_${i}`} obj={msg} />
                                                }
                                                else {
                                                    return <LeftMessage key={`left_msg_${i}`} obj={msg} />
                                                }
                                            })
                                        }

                                        <div ref={scrollBottomRef} ></div>
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
                                        {
                                            window?.walletConnection?.getAccountId() &&
                                            <input ref={msgInputRef}
                                                type="text"
                                                className='custom-input'
                                                placeholder='Type your message here ...'
                                                onKeyDown={getHotkeyHandler([
                                                    ['Enter', sendMsg],
                                                ])} />
                                        }
                                        {
                                            !window?.walletConnection?.getAccountId() &&
                                            <ConnectWalletButton />
                                        }
                                        <ActionIcon radius="xl" size={32}>
                                            <IconMoodSmile color='black' />
                                        </ActionIcon>
                                        <ActionIcon radius="xl" size={32}>
                                            <IconCamera color='black' />
                                        </ActionIcon>
                                        <ActionIcon radius="xl" size={32} onClick={sendMsg}>
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

export default TokenChat