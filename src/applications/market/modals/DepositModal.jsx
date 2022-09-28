import React, { useState } from 'react'
import { Button, Group, Modal, Paper, Stepper, Text, TextInput, Title, NumberInput, ScrollArea, Center, Stack, Avatar, useMantineTheme } from '@mantine/core';
import { IconArrowBarUp, IconArrowForward, IconArrowBack, IconCurrencyDollar, IconExclamationMark, IconCheck } from '@tabler/icons';
import { getTheme } from '../../../app/appFunctions';
import { useNavigate } from 'react-router-dom';

import BigNumber from 'bignumber.js'
import { utils } from 'near-api-js';
import { useEffect } from 'react';
import { useMemo } from 'react';
import { CONTRACT, NEAR_OBJECT } from '../../../app/appconfig';
import { showNotification } from '@mantine/notifications';
import { BigNumberCompare, getReadableTokenBalance } from '../../../app/nearutils';
import { current } from '@reduxjs/toolkit';

const Asset = ({ token, current_token, select, setMetadata, settokenbal }) => {
    const theme = useMantineTheme()

    const [metadata, setTokenMetadata] = useState({})
    const [bal, setBal] = useState("0")
    const [err, setErr] = useState(true)

    const getTokenMetadata = () => {
        const wallet = window.walletConnection
        if (wallet) {
            wallet.account().viewFunction(current_token, "ft_metadata", {}, "3000000000000000").then(res => {
                setTokenMetadata(current => ({ ...current, ...res }))
                setErr(false)
            }).catch(err => {
                // console.log("nothing")
                setErr(true)
            })
        }
    }

    const getTokenBalance = () => {
        const wallet = window.walletConnection
        if (wallet) {
            const account = wallet.getAccountId()
            wallet.account().viewFunction(current_token, "ft_balance_of", { account_id: account }).then(res => {
                setBal(res)
                setTokenMetadata(current => ({ ...current, balance: res }))
            })
                .catch(err => {

                })
        }
    }

    useEffect(() => {
        getTokenBalance()
        getTokenMetadata()
    }, [])

    return (
        <>
            {
                !err && metadata && (
                    <Paper p="xs" radius="md" sx={theme => ({
                        background: getTheme(theme) ? theme.colors.dark[6] : theme.colors.gray[2],
                        cursor: "pointer",
                        borderColor: token === current_token ? theme.colors.blue[6] : "transparent",
                        borderWidth: "1px",
                        borderStyle: "solid"
                    })} onClick={e => {
                        select(current_token)
                        setMetadata(metadata)
                        settokenbal(bal)
                    }}>
                        <Group>
                            <Avatar src={metadata?.icon} />
                            <Stack spacing={0} p={0}>
                                <Text color={token === current_token ? theme.colors.blue[6] : getTheme(theme) ? theme.colors.gray[1] : theme.colors.dark[6]}>
                                    {metadata?.symbol}
                                </Text>
                                <Text color={token === current_token ? theme.colors.blue[6] : getTheme(theme) ? theme.colors.gray[1] : theme.colors.dark[6]}>
                                    {getReadableTokenBalance(bal || "0", metadata?.decimals)}
                                </Text>
                            </Stack>
                            <IconCheck color={token === current_token ? theme.colors.blue[6] : "transparent"} />
                        </Group>
                    </Paper>
                )
            }
        </>
    )
}

const DepositModal = () => {
    const [open, setOpen] = useState(false)
    const [step, setStep] = useState(0)
    const [amount, setAmount] = useState(0)

    const theme = useMantineTheme()

    const [loading, setLoading] = useState(false)
    const [token, setToken] = useState(null)
    const [tokenBal, setTokenBal] = useState(0)

    const [amtToDeposit, setAmtToDeposit] = useState('')
    const [tokenMetadata, setTokenMetadata] = useState(NEAR_OBJECT)
    const [walletTokens, setWalletTokens] = useState(null)

    const [loadingNearAcc, setLoadingNearAcc] = useState(true)
    const [nearAccount, setNearAccount] = useState(null)

    const navigate = useNavigate()

    const nearDeposit = () => {
        const contract = window.contract
        const conn = window.walletConnection
        if (amtToDeposit === 0) {
            showNotification({
                message: 'Please enter an amount to deposit',
                color: 'red',
                icon: <IconExclamationMark />,
            })
            return
        }
        else if (contract && conn && contract.contract_deposit) {
            const amt = utils.format.parseNearAmount(amtToDeposit)
            contract.contract_deposit({
                account_id: conn.getAccountId()
            }, "300000000000000", amt).then(res => {
                console.log(res)
            }).catch(err => {
                console.log(err)
            }).finally(() => {
                setLoading(false)
            })
        }
    }

    const tokenDeposit = () => {
        const wallet = window.walletConnection
        const amt = new BigNumber(amtToDeposit).multipliedBy(10 ** tokenMetadata.decimals).toFixed()
        if (amtToDeposit === 0) {
            showNotification({
                message: 'Please enter an amount to deposit',
                color: 'red',
                icon: <IconExclamationMark />,
            })
            return
        }
        else if (wallet) {
            wallet.account().functionCall(token, "ft_transfer_call", { receiver_id: CONTRACT, amount: amt, msg: 'Take My Money' }, 100000000000000, 1).then(res => {
            }).catch(err => {
                console.log("ft transfer error", err)
            })
        }
    }

    const deposit = () => {
        if (token === "near") {
            nearDeposit()
        }
        else {
            tokenDeposit()
        }
    }


    const getTokenMetadata = () => {
        const wallet = window.walletConnection
        if (wallet) {
            wallet.account().viewFunction(token, "ft_metadata", {}, "3000000000000000").then(res => {
                setTokenMetadata(res)
            })
        }
    }

    const getToken = (metadata) => {
        if (token === "near") {
            setTokenMetadata(NEAR_OBJECT)
        }
        else {
            setTokenMetadata(metadata)
        }
    }

    const settokenbalance = (bal) => {
        if (token === "near") {
            setTokenBal(nearAccount.available)
        }
        else {
            setTokenBal(bal)
        }
    }


    const getNearAccount = async () => {
        setLoadingNearAcc(true)
        const contract = window.contract
        const conn = window.walletConnection
        if (contract && conn) {
            const accountId = conn.getAccountId()
            const acc = conn.account(accountId)

            const accBal = await acc.getAccountBalance()
            const accDetails = await acc.getAccountDetails()
            const accState = await acc.state()
            const allDetails = { ...accBal, ...accDetails, ...accState }
            // console.log(allDetails)
            setNearAccount(allDetails)
            setLoadingNearAcc(false)
        }
    }

    const selectToken = (address) => {
        setToken(address)
    }

    const getUserWalletTokens = async () => {
        const wallet = window.walletConnection
        if (!wallet) {
            return
        }
        else {
            const res = await fetch(
                `https://testnet-api.kitwallet.app/account/${wallet.getAccountId()}/likelyTokens`,
                {
                    method: 'GET',
                    headers: { 'Content-type': 'application/json; charset=UTF-8' },
                }
            )
                .then((res) => res.json())
                .then((tokens) => {
                    setWalletTokens(tokens)
                    return tokens
                })
            return res
        }
    };

    const goBack = () => {
        navigate(-1)
    }

    // useEffect(() => {
    //     getToken()
    // }, [token])

    useMemo(() => {
        getUserWalletTokens()
        getNearAccount()
    }, [])

    return (
        <>
            <Button radius="xl" style={{
                height: '44px'
            }} variant="outline" color="gray.4" onClick={e => setOpen(true)}>
                <Group>
                    <>Deposit</>
                    <IconArrowBarUp size={18} />
                </Group>
            </Button>
            <Modal opened={open}
                title="Deposit"
                radius="lg"
                size="xl"
                transition="fade"
                // style={{ height: "70vh" }}
                onClose={e => setOpen(false)} >
                <Title order={2} mb="sm" align='center'>Deposit Assets To Your Account</Title>
                <Text align='center' mb="sm">Deposit in easy steps and start trading today!</Text>
                <Paper p="xs" radius="lg" sx={theme => ({
                    background: getTheme(theme) ? theme.colors.dark[5] : theme.colors.gray[1],
                    height: "330px"
                })}>
                    <Stepper active={step}
                    // onSelect={e => setStep(e.currentTarget.v)}
                    >
                        <Stepper.Step value={0} label="Select Asset">
                            <TextInput radius="xl" size='md' placeholder='Search Asset' />
                            <ScrollArea style={{ height: "200px" }}>
                                <Paper px="xs" py="xs" sx={theme => ({
                                    background: "transparent"
                                })}>

                                    <Group>
                                        <Paper p="xs" radius="md" sx={theme => ({
                                            background: getTheme(theme) ? theme.colors.dark[6] : theme.colors.gray[2],
                                            cursor: "pointer",
                                            borderColor: token === "near" ? theme.colors.blue[6] : "transparent",
                                            borderWidth: "1px",
                                            borderStyle: "solid"
                                        })} onClick={e => {
                                            selectToken("near")
                                            settokenbalance(nearAccount.available)
                                        }}>
                                            <Group>
                                                <Avatar src={NEAR_OBJECT.icon} />
                                                <Stack spacing={0} p={0}>
                                                    <Text color={token === "near" ? theme.colors.blue[6] : getTheme(theme) ? theme.colors.gray[1] : theme.colors.dark[6]}>Near</Text>
                                                    <Text color={token === "near" ? theme.colors.blue[6] : getTheme(theme) ? theme.colors.gray[1] : theme.colors.dark[6]}>{getReadableTokenBalance(nearAccount?.available, 24)}</Text>
                                                </Stack>
                                                <IconCheck color={token === "near" ? theme.colors.blue[6] : "transparent"} />
                                            </Group>
                                        </Paper>
                                        {
                                            walletTokens && walletTokens.map((t, i) => (
                                                <Asset key={`my_token__${i}`} token={token} current_token={t} select={selectToken} setMetadata={getToken} settokenbal={settokenbalance} />
                                            ))
                                        }
                                    </Group>

                                </Paper>
                            </ScrollArea>
                        </Stepper.Step>
                        <Stepper.Step value={1} label="Make The Deposit">
                            <TextInput value={amtToDeposit} onChange={e => setAmtToDeposit(e.target.value)} radius="xl" size='md' placeholder='Enter Amount' min={1} />
                            <Center style={{ height: "200px" }}>
                                <Stack align="center" spacing={0}>
                                    <Title order={2}>Amount To Deposit</Title>
                                    <Title my="sm">{amtToDeposit}</Title>
                                    <Title order={4} >{tokenMetadata?.symbol} - {tokenMetadata?.name}</Title>
                                </Stack>
                            </Center>
                        </Stepper.Step>
                    </Stepper>
                </Paper>
                <Group mt="md" position='center'>
                    <Button radius="xl" color="violet"
                        style={{ width: "100px", height: "42px" }}
                        leftIcon={<IconArrowBack />}
                        disabled={step === 0}
                        onClick={e => setStep(0)}>
                        Back
                    </Button>
                    {
                        step === 0 && (
                            <Button radius="xl" color="violet"
                                style={{ width: "100px", height: "42px" }}
                                rightIcon={<IconArrowForward />}
                                onClick={e => setStep(1)}
                            >
                                Next
                            </Button>
                        )}
                    {step === 1 && (
                        <Button radius="xl" color="violet"
                            style={{ height: "42px" }}
                            rightIcon={<IconCurrencyDollar />}
                            onClick={deposit}
                        >
                            Deposit
                        </Button>
                    )}
                </Group>
            </Modal>
        </>
    )
}

export default DepositModal