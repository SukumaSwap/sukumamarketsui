import React, { useState } from 'react'
import { Button, Group, Modal, Paper, Stepper, Text, TextInput, Title, NumberInput, ScrollArea, Center, Stack, Avatar, useMantineTheme } from '@mantine/core';
import { IconArrowBarUp, IconArrowForward, IconArrowBack, IconCurrencyDollar, IconExclamationMark, IconCheck } from '@tabler/icons';
import { getTheme } from '../../../app/appFunctions';

import BigNumber from 'bignumber.js'
import { utils } from 'near-api-js';
import { useEffect } from 'react';
import { useMemo } from 'react';
import { CONTRACT, NEAR_OBJECT } from '../../../app/appconfig';
import { showNotification } from '@mantine/notifications';
import { BigNumberCompare, getReadableTokenBalance, makeTokens } from '../../../app/nearutils';

const Asset = ({ token, current_token, select, setMetadata, settokenbal }) => {
    const theme = useMantineTheme()

    const [metadata, setTokenMetadata] = useState({})
    const [err, setErr] = useState(false)

    const getTokenMetadata = () => {
        const wallet = window.walletConnection
        if (current_token?.tokenId === "near") {
            setTokenMetadata(NEAR_OBJECT)
            return
        }
        else {
            if (wallet) {
                wallet.account().viewFunction(current_token?.tokenId, "ft_metadata", {}, "3000000000000000").then(res => {
                    setTokenMetadata(current => ({ ...current, ...res }))
                    setErr(false)
                }).catch(err => {
                    setErr(true)
                })
                return
            }
            return
        }
    }

    useEffect(() => {
        getTokenMetadata()
    }, [])

    return (
        <>
            {
                !err && metadata && (
                    <Paper p="xs" radius="md" sx={theme => ({
                        background: getTheme(theme) ? theme.colors.dark[6] : theme.colors.gray[2],
                        cursor: "pointer",
                        borderColor: token === current_token?.tokenId ? theme.colors.blue[6] : "transparent",
                        borderWidth: "1px",
                        borderStyle: "solid"
                    })} onClick={e => {
                        select(current_token?.tokenId)
                        setMetadata(metadata)
                        settokenbal(current_token?.balance)
                    }}>
                        <Group>
                            <Avatar src={metadata?.icon} />
                            <Stack spacing={0} p={0}>
                                <Text color={token === current_token?.tokenId ? theme.colors.blue[6] : getTheme(theme) ? theme.colors.gray[1] : theme.colors.dark[6]}>
                                    {metadata?.symbol}
                                </Text>
                                <Text color={token === current_token?.tokenId ? theme.colors.blue[6] : getTheme(theme) ? theme.colors.gray[1] : theme.colors.dark[6]}>
                                    {getReadableTokenBalance(current_token?.balance || "0", metadata?.decimals)}
                                </Text>
                            </Stack>
                            <IconCheck color={token === current_token?.tokenId ? theme.colors.blue[6] : "transparent"} />
                        </Group>
                    </Paper>
                )
            }
            {
                err && "something "
            }
        </>
    )
}

const WithdrawModal = () => {
    const [open, setOpen] = useState(false)
    const [step, setStep] = useState(0)

    const theme = useMantineTheme()

    const [loading, setLoading] = useState(false)
    const [token, setToken] = useState(null)
    const [tokenBal, setTokenBal] = useState(0)

    const [amtToDeposit, setAmtToDeposit] = useState('')
    const [tokenMetadata, setTokenMetadata] = useState(NEAR_OBJECT)

    const [acc, setAcc] = useState(null)

    const [searchedToken, setSearchedToken] = useState("")

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

    const getToken = (metadata) => {
        setTokenMetadata(metadata)
    }

    const settokenbalance = (bal) => {
        setTokenBal(bal)
    }

    const selectToken = (address) => {
        setToken(address)
    }

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

    useMemo(() => {
        loadAccount()
    }, [])

    return (
        <>
            <Button radius="xl" style={{
                height: '44px',
                color: getTheme(theme) ? theme.colors.gray[1] : theme.colors.dark[6]
            }} variant="outline" onClick={e => setOpen(true)}>
                <Group>
                    <>Withdraw</>
                    <IconArrowBarUp size={18} />
                </Group>
            </Button>
            <Modal opened={open}
                title="Withdraw"
                radius="lg"
                size="xl"
                transition="fade"
                // style={{ height: "70vh" }}
                onClose={e => setOpen(false)} >
                <Title order={2} mb="sm" align='center'>Withdraw Assets From Your Account</Title>
                <Text align='center' mb="sm">Withdraw directly to your main wallet.</Text>
                <Paper p="xs" radius="lg" sx={theme => ({
                    background: getTheme(theme) ? theme.colors.dark[5] : theme.colors.gray[1],
                    height: "330px"
                })}>
                    <Stepper active={step}
                    // onSelect={e => setStep(e.currentTarget.v)}
                    >
                        <Stepper.Step value={0} label="Select Asset">
                            <ScrollArea style={{ height: "200px" }}>
                                <Paper px="xs" py="xs" sx={theme => ({
                                    background: "transparent"
                                })}>

                                    <Group>
                                        {
                                            acc && [{ tokenId: "near", balance: acc?.balance }].concat(makeTokens(acc?.tokens)).map((t, i) => (
                                                <Asset key={`my_token__${i}`} token={token} current_token={t} select={selectToken} setMetadata={getToken} settokenbal={settokenbalance} />
                                            ))
                                        }
                                    </Group>

                                </Paper>
                            </ScrollArea>
                        </Stepper.Step>
                        <Stepper.Step value={1} label="Make The Withdrawal">
                            <NumberInput value={amtToDeposit} onChange={value => setAmtToDeposit(value)} radius="xl" size='md' placeholder='Enter Amount' min={1} />
                            <Center style={{ height: "200px" }}>
                                <Stack align="center" spacing={0}>
                                    <Title order={2}>Amount To Withdraw</Title>
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
                            onClick={e => console.log}
                        >
                            Withdraw
                        </Button>
                    )}
                </Group>
            </Modal>
        </>
    )
}

export default WithdrawModal