import React, { useState, useEffect } from 'react'
import { Paper, Grid, Title, Center, Avatar, Text, Group, ScrollArea, Box, Button, TextInput, Loader } from '@mantine/core';
import { formatNumber, getTheme } from '../../../../app/appFunctions';
import { IconChevronRight, IconExclamationMark, IconCheck, IconX } from '@tabler/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { calcOfferRate, getTokenPrice, getReadableTokenBalance, SukMarketViewFunctionCall } from '../../../../app/nearutils';
import { showNotification } from '@mantine/notifications';
import BigNumber from 'bignumber.js';

import { nanoid } from 'nanoid'

import { db, doc, setDoc } from '../../../../app/firebaseconfig';
import { UserProfileCard } from '../../../../components/common/near/UserProfileCard';
import TokenPreview from '../../../../components/common/near/TokenPreview';


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


const CreateTokenBuyTrade = () => {

    const navigate = useNavigate()

    const [pay, setPay] = useState(0)
    const [receive, setReceive] = useState(0)

    const [loading, setLoading] = useState(false)
    const [loadingOffer, setLoadingOffer] = useState(false)
    const [offerDetails, setOfferDetails] = useState(null)

    const [tokenPrice, setTokenPrice] = useState(null)
    const [nearPrice, setNearPrice] = useState(null)

    const [CURRENT_USD_PRICE_IN_KES, setCURRENT_USD_PRICE_IN_KES] = useState(118.75)

    // Trade costs
    const [sendCost, setSendCost] = useState(0)
    // const [tradeCost, setTradeCost] = useState(0);
    // const [tradeCostUSD, setTradeCostUSD] = useState(0);
    // const [tokensInNEAR, setTokensInNEAR] = useState(0);
    // const [ER_N_to_T, setER_N_to_T] = useState(0); // ER - Exchange rate Near to token
    // const [ER_T_to_N, setER_T_to_N] = useState(0); // ER - Exchange rate Token to near
    // Trade costs

    const { offer_id } = useParams()

    const confirmAmtToPay = (value) => {
        if (offerDetails) {
            if (new BigNumber(value).isGreaterThan(getReadableTokenBalance(offerDetails?.max_amount, offerDetails?.token?.decimals))) {
                showNotification({
                    title: "Error",
                    message: `You can only buy up to ${getReadableTokenBalance(offerDetails.max_amount, offerDetails?.token?.decimals)} ${offerDetails?.token?.symbol}`,
                    color: "red"
                })
                return
            }
            else if (new BigNumber(value).isLessThan(getReadableTokenBalance(offerDetails?.min_amount, offerDetails?.token?.decimals))) {
                showNotification({
                    title: "Error",
                    message: `You can only buy at least ${getReadableTokenBalance(offerDetails.min_amount, offerDetails?.token?.decimals)} ${offerDetails?.token?.symbol}`,
                    color: "red"
                })
                return
            }
        }
    }

    const payChange = (value) => {
        const SELLER_NEAR_PRICE_IN_USD = calcOfferRate(offerDetails?.offer_rate, tokenPrice)

        setPay(value)

        if (SELLER_NEAR_PRICE_IN_USD === 'N/A') {
            setReceive(0)
        }
        else {
            // const receive_ = (value * SELLER_NEAR_PRICE_IN_USD) * CURRENT_USD_PRICE_IN_KES
            const receive_ = (value / CURRENT_USD_PRICE_IN_KES) / SELLER_NEAR_PRICE_IN_USD
            confirmAmtToPay(receive_)
            setReceive(receive_)

        }

    }

    const receiveChange = (value) => {
        const SELLER_NEAR_PRICE_IN_USD = calcOfferRate(offerDetails?.offer_rate, tokenPrice)

        setReceive(value)

        if (SELLER_NEAR_PRICE_IN_USD === 'N/A') {
            setPay(0)
        }
        else {
            // const pay_ = (value * SELLER_NEAR_PRICE_IN_USD) * CURRENT_USD_PRICE_IN_KES
            const pay_ = (value * SELLER_NEAR_PRICE_IN_USD) * CURRENT_USD_PRICE_IN_KES
            setPay(pay_)
        }

        confirmAmtToPay(value)
    }

    const initiateChat = () => {
        // Need to navigate to current path + "/chat"
        const chat_id = nanoid(20) + Date.now()

        const contract = window.contract
        const conn = window.walletConnection

        if (pay === 0 || receive === 0) {
            showNotification({
                title: "Error",
                message: "Please enter valid amounts",
                color: "red",
            })
            return
        }

        if (new BigNumber(receive).isGreaterThan(getReadableTokenBalance(offerDetails?.max_amount, offerDetails?.token?.decimals))) {
            showNotification({
                title: "Error",
                message: `You can only buy up to ${getReadableTokenBalance(offerDetails.max_amount, offerDetails?.token?.decimals)} ${offerDetails?.token?.symbol}`,
                color: "red"
            })
            return
        }
        else if (new BigNumber(receive).isLessThan(getReadableTokenBalance(offerDetails?.min_amount, offerDetails?.token?.decimals))) {
            showNotification({
                title: "Error",
                message: `You can only buy at least ${getReadableTokenBalance(offerDetails.min_amount, offerDetails?.token?.decimals)} ${offerDetails?.token?.symbol}`,
                color: "red"
            })
            return
        }

        if (contract && conn && contract.add_sell_chat) {
            const amt_ = new BigNumber(receive).multipliedBy(10 ** offerDetails?.token?.decimals)
            const amt = amt_.toFixed()

            // let ER_N_to_T = nearPrice / tokenPrice; 
            const ER_T_to_N = tokenPrice / nearPrice; 
            const tokens_usd = receive * parseFloat(tokenPrice);
            const tokens_in_near = (tokens_usd * ER_T_to_N ) / parseFloat(nearPrice);
            const trade_cost_near = new BigNumber(tokens_in_near).multipliedBy(sendCost) 
            const trade_cost = trade_cost_near.multipliedBy(1e24).toFixed();
            const trade_cost_usd = new BigNumber(tokens_in_near).multipliedBy(sendCost).multipliedBy(nearPrice);
            
            const chat = {
                id: chat_id,
                offer_id: offer_id,
                token_id: offerDetails?.token?.address,
                owner: conn.getAccountId(),
                amount: amt,
                payer: conn.getAccountId(),
                receiver: offerDetails.offerer?.id,
                payment_msg: `<b>${conn.getAccountId()}</b> will pay <b>${offerDetails?.offerer?.id}</b> <b>${offerDetails?.currency} ${formatNumber(Math.round(pay))}</b> for <b>${formatNumber(receive)} ${offerDetails?.token?.name}</b>. Approximately <b>$${formatNumber(Math.round(pay / CURRENT_USD_PRICE_IN_KES))}</b>`,
                trade_cost,
                trade_cost_usd: parseFloat(trade_cost_usd)
            }
            console.log(chat)
            setLoading(true)
            contract.add_token_sell_chat(chat).then(res => {
                console.log("Chat creation", res)
                if (res.trim() === "Offer not found".trim()) {
                    showNotification({
                        title: "Chat creation failed",
                        message: "Offer not found",
                        color: "blue",
                        icon: <IconExclamationMark />
                    })
                }
                else if (res.trim() === "Insufficient balance".trim()) {
                    showNotification({
                        title: "Chat creation failed",
                        message: "Offerer does not have enough balance to continue with this trade. Try another one.",
                        color: "blue",
                        icon: <IconExclamationMark />
                    })
                }
                else if (res.trim() === "You do not have sufficient funds to honor this trade".trim()) {
                    showNotification({
                        title: "Chat creation failed",
                        message: "You do not have sufficient funds to honor this trade. Consider depositing.",
                        color: "blue",
                        icon: <IconExclamationMark />
                    })
                }
                else if (res.trim() === "You can't chat with yourself".trim()) {
                    showNotification({
                        title: "Chat creation failed",
                        message: "You can't chat with yourself",
                        color: "blue",
                        icon: <IconExclamationMark />
                    })
                }
                else if (res.trim() === "You must be a registered user to chat with someone".trim()) {
                    showNotification({
                        title: "Chat creation failed",
                        message: "You must have your address in the smart contract to chat with someone.",
                        color: "blue",
                        icon: <IconExclamationMark />
                    })
                }
                else if (res.trim() === "You don't have enough balance to chat with someone".trim()) {
                    showNotification({
                        title: "Chat creation failed",
                        message: "You don't have enough balance to chat with someone.",
                        color: "blue",
                        icon: <IconExclamationMark />
                    })
                }
                else if (res.trim() === "created".trim()) {
                    showNotification({
                        title: "Chat saved",
                        message: "Trage initiated",
                        color: "green",
                        icon: <IconCheck />
                    })
                    // Create chat and Navigate to chat page
                    createChat(chat_id);
                }
                else {
                    showNotification({
                        title: "Chat creation failed",
                        message: res,
                        color: "red",
                        icon: <IconX />
                    })
                }
            }).catch(err => {
                showNotification({
                    title: "Error",
                    message: "An error occured while creating the chat. Please try again later.",
                    color: "red",
                    icon: <IconCheck />
                })
            }).finally(() => {
                setLoading(false)
            })
        }

    }

    const createChat = async (chat_id) => {
        const chat_path = `/near/chats/assets/${chat_id}`
        // Payer and receiver are marked in terms of KES, receiver - is the receiver of the KES in this case the receiver and vice versa
        setDoc(doc(db, "chatmsgs", chat_id), {
            messages: [],
            chatOwner: window.walletConnection.getAccountId(),
            offerer: offerDetails.offerer,
            offer_type: offerDetails.offer_type,
            amount: pay,
            offer_id: offer_id,
            payer: window.walletConnection.getAccountId(),
            receiver: offerDetails.offerer,
            paid: false,
            received: false,
            canceled: false,
            active: true,
            admin: null,
        })
        showNotification({
            title: "Chat created",
            message: "Chat created successfully",
            color: "green",
            icon: <IconExclamationMark />
        })
        setLoading(false)
        navigate(chat_path)
    }

    const loadOfferDetails = () => {
        setLoadingOffer(true)
        const wallet = window.walletConnection
        if (wallet) {
            SukMarketViewFunctionCall(wallet, {
                methodName: "pub_get_token_offer",
                args: { offer_id }
            }).then(res => {
                setOfferDetails(res)
                getPrice(res?.token?.address)
            }).catch(err => {
                console.log("Fetching offer error", err)
            })
        }
    }

    const getPrice = (address) => {
        if (address === "wrap.testnet") {
            getTokenPrice(address).then(res => {
                setNearPrice(res?.price)
                setTokenPrice(res?.price)
            }).catch(err => {
                // console.log("Token price error", err)
            })
            return;
        }
        else {
            getTokenPrice(address).then(res => {
                setTokenPrice(res?.price)
            }).catch(err => {
                // console.log("Token price error", err)
            })
            return;
        }
    }

    const loadSendCost = () => {
        const wallet = window.walletConnection
        if (wallet) {
            SukMarketViewFunctionCall(wallet, {
                methodName: "get_send_cost",
                args: {}
            }).then(res => {
                setSendCost(res)
            }).catch(err => {
                console.log("Fetching sending cost error", err)
            })
        }
    }

    useEffect(() => {
        getPrice("wrap.testnet")
        loadOfferDetails()
        loadSendCost()
    }, [offer_id])

    return (
        <>
            <Paper p="xs" radius="md" sx={theme => ({
                height: 'calc(100vh - 60px)',
            })}>
                <Grid className='h-100'>
                    <Grid.Col md={5} className='h-100'>
                        <ScrollArea className='h-100'>
                            <Paper px="md">
                                <section>
                                    <UserProfileCard offerDetails={offerDetails} />
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
                                        background: getTheme(theme) ? theme.colors.dark[4] : theme.colors.gray[0]
                                    })}>
                                        <Title order={3}>Offer Details</Title>
                                        <TokenPreview offerDetails={offerDetails} tokenPrice={tokenPrice} />
                                        <OfferDetail obj={{
                                            title: "Minimum Amount",
                                            value: getReadableTokenBalance(offerDetails?.min_amount, offerDetails?.token?.decimals),
                                            alignment: "end"
                                        }} />
                                        <OfferDetail obj={{
                                            title: "Maximum Amount",
                                            value: getReadableTokenBalance(offerDetails?.max_amount, offerDetails?.token?.decimals),
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
                    <Grid.Col md={7} className='h-100'>
                        <Paper p="xl" className='h-100' radius="lg" sx={theme => ({
                            background: getTheme(theme) ? theme.colors.dark[4] : theme.colors.gray[0]
                        })}>
                            <Center>
                                <Paper style={{ width: "70%", background: "transparent" }}>
                                    <Title order={3} align="center" mb="md">How much do you need?</Title>
                                    <Box px="xl">
                                        <Text mb="sm">I will receive</Text>
                                        <Grid>
                                            <Grid.Col xs={1}>
                                                <Center style={{ height: "100%" }}>
                                                    <Avatar src={offerDetails?.token?.icon} />
                                                </Center>
                                            </Grid.Col>
                                            <Grid.Col xs={11}>
                                                <TextInput
                                                    size='md'
                                                    value={receive}
                                                    onChange={e => receiveChange(e.target.value)} />
                                            </Grid.Col>
                                        </Grid>
                                    </Box>
                                    <Box px="xl" my="md">
                                        <Text mb="sm">I will pay</Text>
                                        <Grid>
                                            <Grid.Col xs={1}>
                                                <Center style={{
                                                    height: "100%"
                                                }}>
                                                    <Text>{offerDetails?.currency}</Text>
                                                </Center>
                                            </Grid.Col>
                                            <Grid.Col xs={11}>
                                                <TextInput size='md'
                                                    value={pay}
                                                    onChange={e => payChange(e.target.value)} />
                                            </Grid.Col>
                                        </Grid>
                                    </Box>
                                    <Center mt="lg">
                                        <Group>
                                            <Button rightIcon={<IconChevronRight />} sx={theme => ({
                                                width: "150px",
                                                height: "50px",
                                                borderRadius: theme.radius.xl,
                                                background: getTheme(theme) ? theme.colors.dark[5] : theme.colors.gray[5],
                                                ":hover": {
                                                    background: getTheme(theme) ? theme.colors.dark[6] : theme.colors.gray[6],
                                                }
                                            })} onClick={initiateChat}>Start Chat</Button>
                                            {
                                                loading && <Loader variant='oval' size="md" />
                                            }
                                        </Group>
                                    </Center>
                                    <Text color="green" align="center" my="md">
                                        You will receive ≈ {formatNumber(receive)} {offerDetails?.token?.symbol}  for ≈ {offerDetails?.currency} {formatNumber(Math.round(pay))} ≈ ${formatNumber(Math.round(pay / CURRENT_USD_PRICE_IN_KES))}
                                    </Text>
                                </Paper>
                            </Center>
                        </Paper>
                    </Grid.Col>
                </Grid>
            </Paper>
        </>
    )
}

export default CreateTokenBuyTrade