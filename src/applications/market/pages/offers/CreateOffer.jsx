import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BigNumber } from "bignumber.js"

import { Group, Stepper, Text, Button as MButton, useMantineTheme, Loader, Button as MTButton, TextInput, Modal, Menu, Title, Alert, ActionIcon, Divider, Paper, Container, Grid, ScrollArea, Center, Stack, NumberInput, Select, Table, Avatar, Textarea, Box } from '@mantine/core'
import { nanoid } from 'nanoid'
import { showNotification } from '@mantine/notifications'
import { IconAlertCircle, IconArrowBack, IconArrowForward, IconArrowLeft, IconArrowRight, IconArrowUp, IconCheck, IconChevronLeft, IconCurrencyBitcoin, IconCurrencyDollar, IconUpload, IconX } from '@tabler/icons'

import { useModals } from '@mantine/modals'
import { getMessage } from '../../../../app/nearutils'
import { PAYMENT_OPTIONS, WHITELISTEDTOKENS_, NEAR_OBJECT, CONTRACT, CURRENCIES } from '../../../../app/appconfig'
import { APP_NAME } from '../../../../app/constants'
import ImportTokenModal from '../../../../components/common/ImportToken';
import { getTheme } from '../../../../app/appFunctions'
import GoBackButton from '../../../../components/common/GoBackButton';
import RegisterContractModal from '../../modals/RegisterContractModal'

const DataRow = ({ data }) => {
    return (
        <tr >
            <td >
                {data.title}
            </td>
            <td >
                {data.value}
            </td>
        </tr>
    )
}


const CreateOffer = () => {

    const [token, setToken] = useState('')
    const [min_amt, setMinAmt] = useState(0)
    const [max_amt, setMaxAmt] = useState(0)
    const [offerType, setOfferType] = useState('')
    const [payment, setPayment] = useState('')
    const [currency, setCurrency] = useState('')
    const [instructions, setInstructions] = useState('')
    const [offerRate, setOfferRate] = useState(0)
    const [loading, setLoading] = useState(false)
    const [searchedToken, setSearchedToken] = useState('')

    const [modalOpen, setModalOpen] = useState(false)

    const [tokens, setTokens] = useState([])
    const [currencies, setCurrencies] = useState([])
    const [payments, setPayments] = useState([])

    const [FtAccountModal, setFtAccountModal] = useState(false)

    const [active, setActive] = useState(0);
    const prevStep = () => setActive((current) => (current > 0 ? current - 1 : current));
    const nextStep = () => setActive((current) => (current < 5 ? current + 1 : current));

    const modals = useModals();

    const navigate = useNavigate()

    const theme = useMantineTheme()

    const goBack = () => {
        navigate(-1)
    }

    const resetInputs = () => {
        setMinAmt(0)
        setMaxAmt(0)
        setOfferRate(0)
        setOfferType('')
        setPayment('')
        setToken('')
        setActive(0)
        setCurrency("")
    }

    const handleData = () => {
        if (token === '') {
            showNotification({
                title: "Error",
                message: 'Please select a token to continue.',
                color: 'red',
                icon: <IconX size={16} />
            })
            setLoading(false)
            return false
        }
        if (offerType === '') {
            showNotification({
                title: "Error",
                message: 'Please select offer type',
                color: 'red',
                icon: <IconX size={16} />
            })
            setLoading(false)
            return false
        }
        if (parseFloat(max_amt) === 0) {
            showNotification({
                title: "Error",
                message: 'Please enter valid max amount',
                color: 'red',
                icon: <IconX size={16} />
            })
            setLoading(false)
            return false
        }

        if (parseFloat(min_amt) > parseFloat(max_amt)) {
            showNotification({
                title: "Error",
                message: 'Minimum amount should be less than maximum amount',
                color: 'red',
                icon: <IconX size={16} />
            })
            setLoading(false)
            return false
        }
        if (instructions === '') {
            showNotification({
                title: "Error",
                message: 'Please enter a few instructions for the offer.',
                color: 'red',
                icon: <IconX size={16} />
            })
            setLoading(false)
            return false
        }
        if (payment === '') {
            showNotification({
                title: "Error",
                message: 'Please select payment option',
                color: 'red',
                icon: <IconX size={16} />
            })
            setLoading(false)
            return false
        }
        if (currency === '') {
            showNotification({
                title: "Error",
                message: 'Please select currency',
                color: 'red',
                icon: <IconX size={16} />
            })
            setLoading(false)
            return false
        }

        return true
    }

    const createNearOffer = (contract) => {
        const offerer = window.walletConnection.getAccountId()
        const id = nanoid() + Date.now()
        const min = new BigNumber(min_amt).multipliedBy(10 ** 24).toFixed()
        const max = new BigNumber(max_amt).multipliedBy(10 ** 24).toFixed()

        contract.add_offer({
            id: id.toString(),
            offer_type: offerType,
            offerer: offerer,
            min_amount: min,
            max_amount: max,
            offer_rate: parseFloat(offerRate),
            payment: payment,
            currency: currency,
            instructions: instructions
        }).then(res => {
            if (res.trim() === "You do not have enough balance to add offer".trim()) {
                showNotification({
                    title: "Error: Offer Creation",
                    message: res,
                    color: 'red',
                })
            }
            else if (res.trim() === "Offer created successfully".trim()) {
                successModal()
            }
        }).catch(err => {
            showNotification({
                title: "Error: Offer Creation",
                message: "Could not create the offer. Please check your balance and try again",
                color: 'red',
            })
        }).finally(() => {
            resetInputs()
            setLoading(false)
        })
    }

    const createTokenOffer = (contract) => {
        const offerer = window.walletConnection.getAccountId()
        const id = nanoid() + Date.now()
        let tokenDetails = tokens.find(token_ => token_.address === token)

        if (tokenDetails) {
            const min = new BigNumber(min_amt).multipliedBy(10 ** tokenDetails.decimals).toFixed()
            const max = new BigNumber(max_amt).multipliedBy(10 ** tokenDetails.decimals).toFixed()
            contract.add_token_offer({
                id: id.toString(),
                offer_type: offerType,
                offerer: offerer,
                min_amount: min,
                max_amount: max,
                offer_rate: parseFloat(offerRate),
                token: token,
                payment: payment,
                currency: currency,
                instructions: instructions
            }).then(res => {
                if (res.trim() === "You do not have enough balance to add offer".trim()) {
                    showNotification({
                        title: "Error: Offer Creation",
                        message: res,
                        color: 'red',
                    })
                }
                else if (res.trim() === "Offer created successfully".trim()) {
                    successModal()
                    resetInputs()
                }
            }).catch(err => {
                console.log(err)
                showNotification({
                    title: "Error: Offer Creation",
                    message: "An internal error occured. Please try again later, if it persists, contact the community.",
                    color: 'red',
                    autoClose: 10000,
                })
            }).finally(() => {
                setLoading(false)
            })
        }
        else {
            setLoading(false)
            showNotification({
                title: "404 Not Found",
                message: "Token not found",
                color: 'indigo',
            })
        }
    }

    const createOffer = () => {
        setLoading(true)
        const contract = window.contract
        const conn = window.walletConnection
        const res = handleData()
        if (res === false) return
        if (res) {
            if (!contract && !conn) {
                showNotification({
                    title: "Error",
                    message: 'Please connect to wallet',
                    color: 'red'
                })
                setLoading(false)
                return
            }

            else {
                if (token === "near") {
                    createNearOffer(contract)
                }
                else {
                    createTokenOffer(contract)
                }

            }
        }
    }

    const successModal = () =>
        modals.openModal({
            title: <Title order={4}>Offer Creation</Title>,
            centered: true,
            radius: "lg",
            children: (
                <>
                    <Alert icon={<IconAlertCircle size={16} />} title="Success!" color="green.6">
                        Offer successfully created.
                    </Alert>
                </>
            )
        });

    const getOfferType = (value) => {
        if (value === "buy") return "Buy"
        else if (value === "sell") return "Sell"
        return "None"
    }

    const getPriceImpact = () => {
        if (offerRate > 0) {
            return (
                <div className='d-flex justify-content-between align-items-center'>
                    <div></div>
                    <div>
                        <IconArrowRight />
                    </div>
                    <div className='text-success d-flex align-items-center'>
                        <IconArrowUp />
                        <span>
                            3.42
                        </span>
                    </div>
                </div>
            )
        }
    }

    const openConfirmModal = () => {
        const res = handleData()
        if (res === false) return
        return modals.openConfirmModal({
            title: <h5 className='m-0 p-0'>{getOfferType(offerType)} Offer Creation</h5>,
            centered: true,
            children: (
                <div>
                    <Text>
                        Are you sure you want to create this offer?
                    </Text>
                </div>
            ),
            labels: { confirm: 'Confirm', cancel: 'Cancel' },
            cancelProps: { color: 'red' },
            confirmProps: { color: 'green' },
            overlayBlur: 3,
            overlayOpacity: 0.1,
            overlayColor: theme.colors.gray[6],
            onCancel: () => console.log('Cancel'),
            onConfirm: () => createOffer(),
        });
    }

    const filterTokens = () => {
        const filteredTokens = tokens.filter(token => {
            const regex = new RegExp(searchedToken, 'i');
            return token.symbol.match(regex) || token.name.match(regex) || token.address.match(regex)
        })
        return filteredTokens
    }


    const getTokens = () => {
        const wallet = window.walletConnection
        const contract = window.contract
        if (wallet && contract) {
            wallet.account().viewFunction(CONTRACT, "get_tokens", {}).then(res => {
                setTokens(res)
            }).catch(err => {
                console.log("Fetching tokens error", err)
            })
        }
    }

    const getCurrencies = () => {
        const wallet = window.walletConnection
        const contract = window.contract
        if (wallet && contract) {
            wallet.account().viewFunction(CONTRACT, "get_currencies", {}).then(res => {
                setCurrencies(res)
            }).catch(err => {
                console.log("Fetching currencies error", err)
            })
        }
    }

    const getPayments = () => {
        const wallet = window.walletConnection
        const contract = window.contract
        if (wallet && contract) {
            wallet.account().viewFunction(CONTRACT, "get_payments", {}).then(res => {
                setPayments(res)
            }).catch(err => {
                console.log("Fetching payments error", err)
            })
        }
    }

    useEffect(() => {
        getTokens()
        getCurrencies()
        getPayments()
    }, [])

    console.log(currencies)

    return (
        <Container p="xs">

            <GoBackButton />

            <RegisterContractModal token={token} />

            <Paper p="xs" radius="md" sx={theme => ({
                background: getTheme(theme) ? theme.colors.dark[6] : theme.colors.gray[2],
                // height: "300px"
            })}>
                <div>
                    <title>{APP_NAME} | Offers - New offer</title>
                    <meta name="description" content="Sign In to Your account" />
                </div>
                <>

                    <div>
                        <ImportTokenModal open={modalOpen} onclose={e => setModalOpen(false)} callbackfn={getTokens} />

                        <Stepper active={active} breakpoint="sm" size='sm' iconSize={32} onStepClick={setActive}>
                            <Stepper.Step label="Token" >

                                <Paper radius="lg" px="xs" py="xs" style={{ height: "300px" }}>
                                    <Title mb="md" order={4} className="mb-3">Select Token</Title>
                                    <Grid>
                                        <Grid.Col xs={10}>
                                            <TextInput radius="xl" value={searchedToken} onChange={e => setSearchedToken(e.target.value)} type="search" placeholder='Search by name | symbol | address' />
                                        </Grid.Col>
                                        <Grid.Col xs={2}>
                                            <MTButton radius={"xl"} variant='filled' color='blue' onClick={e => setModalOpen(true)} leftIcon={<IconUpload size={16} />}>
                                                Import
                                            </MTButton>
                                        </Grid.Col>
                                    </Grid>
                                    <ScrollArea style={{ height: "240px" }}>
                                        <Group py="md">
                                            <MButton leftIcon={<img src={NEAR_OBJECT?.icon} height="24px" alt={NEAR_OBJECT.symbol} />} rightIcon={token === "near" && <IconCheck />} variant={token === "near" ? 'outline' : 'default'} color={token === "near" ? 'blue' : 'gray'} className="w-100" onClick={e => setToken("near")} radius="lg" >
                                                <span className=''>{NEAR_OBJECT?.name}</span>
                                            </MButton>
                                            {
                                                filterTokens().map((token_, index) => {
                                                    return (
                                                        <MButton key={`select_token_${index}`} title={token_.name} leftIcon={<img src={token_?.icon} height="24px" alt={token_.symbol} />} rightIcon={token === token_.address && <IconCheck />} variant={token === token_.address ? 'outline' : 'default'} color={token === token_.address ? 'blue' : 'gray'} className="w-100" onClick={e => setToken(token_.address)} radius="lg">
                                                            <span className=''>{token_.symbol}</span>
                                                        </MButton>
                                                    )
                                                })
                                            }
                                        </Group>
                                    </ScrollArea>
                                </Paper>
                            </Stepper.Step>
                            <Stepper.Step label="Offer Type">
                                <Paper radius="lg" px="xs" py="xs" style={{ height: "300px" }}>
                                    <Center className="h-100">
                                        <Stack>
                                            <Title order={3} mb="xs" align='center'>Select Offer Type</Title>
                                            {/* <Divider className="mb-3" /> */}
                                            <Group>
                                                <MButton radius="xl" style={{ height: "42px" }} leftIcon={<IconCurrencyBitcoin />} rightIcon={offerType === "buy" && <IconCheck />} variant={offerType === "buy" ? 'outline' : 'default'} color={offerType === "buy" ? 'blue' : 'gray'} className="m-2" onClick={e => setOfferType("buy")} >
                                                    <span className=''>Buy</span>
                                                </MButton>
                                                <MButton radius="xl" style={{ height: "42px" }} leftIcon={<IconCurrencyBitcoin />} rightIcon={offerType === "sell" && <IconCheck />} variant={offerType === "sell" ? 'outline' : 'default'} color={offerType === "sell" ? 'blue' : 'gray'} className="m-2" onClick={e => setOfferType("sell")} >
                                                    <span className=''>Sell</span>
                                                </MButton>
                                            </Group>
                                        </Stack>
                                    </Center>
                                </Paper>
                            </Stepper.Step>
                            <Stepper.Step label="Limits & Instructions">
                                <Paper radius="lg" px="xs" py="xs" style={{ height: "300px" }}>
                                    <ScrollArea className='h-100'>
                                        <Center className='h-100'>
                                            <Stack>
                                                <Title order={3} align="center" >Set Offer Limits</Title>
                                                <Grid >
                                                    <Grid.Col sm={6}>
                                                        <NumberInput radius="xl" size='md' label="Minimum Amount" value={min_amt} min={0} onChange={value => setMinAmt(value)} placeholder="Minimum Amount" />
                                                    </Grid.Col>
                                                    <Grid.Col sm={6}>
                                                        <NumberInput radius="xl" size='md' label="Maximum Amount" value={max_amt} onChange={value => setMaxAmt(value)} min={1} placeholder="Maximum Amount" />
                                                    </Grid.Col>
                                                </Grid>
                                                <Textarea label="Enter Instructions"
                                                    autosize
                                                    minRows={4}
                                                    maxRows={5}
                                                    value={instructions}
                                                    onChange={e => setInstructions(e.target.value)} />
                                            </Stack>
                                        </Center>
                                    </ScrollArea>
                                </Paper>
                            </Stepper.Step>
                            <Stepper.Step label="Offer Rate">
                                <Paper radius="lg" px="xs" py="xs" style={{ height: "300px" }}>
                                    <Center className='h-100'>
                                        <Stack>
                                            <Title order={3} align="center">Set Offer Rate</Title>
                                            <NumberInput radius="xl" size="md" value={offerRate}
                                                onChange={value => setOfferRate(value)} placeholder="Offer Rate" />
                                        </Stack>
                                    </Center>
                                </Paper>
                            </Stepper.Step>
                            <Stepper.Step label="Currency">
                                <Paper radius="lg" px="xs" py="xs" style={{ height: "300px", overflow: "hidden" }}>
                                    <Box style={{ height: "70px" }}>
                                        <Title mb="sm" order={4} className="mb-3">Select currency</Title>
                                        <Grid>
                                            <Grid.Col xs={10}>
                                                <TextInput radius="xl" value={searchedToken} onChange={e => setSearchedToken(e.target.value)} type="search" placeholder='Search by name | symbol' />
                                            </Grid.Col>
                                            <Grid.Col xs={2}>
                                                <MTButton radius={"xl"} variant='filled' color='blue' onClick={e => setModalOpen(true)} leftIcon={<IconUpload size={16} />}>
                                                    Import
                                                </MTButton>
                                            </Grid.Col>
                                        </Grid>
                                    </Box>
                                    <ScrollArea style={{ height: "230px" }} py="sm">
                                        <Grid>
                                            {
                                                CURRENCIES.map((cur, i) => {
                                                    return (
                                                        <Grid.Col md={3} key={`select_currency_${i}`} style={{overflow: "hidden"}}>
                                                            <MButton  leftIcon={<b>{cur.symbol}</b>} height="24px" alt={cur.name} rightIcon={currency === cur.symbol && <IconCheck />}
                                                                variant={currency === cur.symbol ? 'outline' : 'default'}
                                                                color={currency === cur.symbol ? 'blue' : 'gray'}
                                                                className="w-100"
                                                                onClick={e => setCurrency(cur.symbol)} radius="lg" >
                                                                <span className=''>{cur.name}</span>
                                                            </MButton>
                                                        </Grid.Col>
                                                    )
                                                })
                                            }

                                        </Grid>
                                    </ScrollArea>
                                </Paper>
                            </Stepper.Step>
                            <Stepper.Step label="Payment & Currency"  >
                                <Paper radius="lg" px="xs" py="xs" style={{ height: "300px" }}>
                                    <Title order={3}>Select Payment Option</Title>
                                    <ScrollArea style={{ height: "180px" }}>
                                        <Group py="xs" position='center'>
                                            {
                                                payments.map((payment_, index) => {
                                                    return (
                                                        <Paper key={`payment_option_${index}`} radius="md" p="xs" onClick={e => setPayment(payment_.name)}
                                                            sx={theme => ({
                                                                background: getTheme(theme) ? theme.colors.dark[6] : theme.colors.gray[2]
                                                            })} >
                                                            <Group>
                                                                <img src={payment_?.icon} alt={payment_.name} style={{ height: "30px" }} />
                                                                <Text color={payment === payment_.name ? theme.colors.blue[6] : theme.colors.gray[2]}>{payment_.name}</Text>
                                                                {payment === payment_.name && <IconCheck color={payment === payment_.name ? theme.colors.blue[6] : theme.colors.gray[2]} />}
                                                            </Group>
                                                        </Paper>
                                                    )
                                                })
                                            }
                                        </Group>
                                    </ScrollArea>
                                    <Center>
                                        <Select label="Select Currency" value={currency} onChange={val => setCurrency(val)} data={currencies} searchable nothingFound="Currency Not Found" />
                                    </Center>
                                </Paper>
                            </Stepper.Step>
                            <Stepper.Step label="Finish">
                                <Paper radius="lg" px="xs" py="xs" style={{ height: "300px" }}>
                                    <Title order={3}>Complete</Title>
                                    <ScrollArea style={{ height: "250px" }}>
                                        <Paper>
                                            <Table verticalSpacing={10}>
                                                <thead>
                                                    <tr>
                                                        <th >Title</th>
                                                        <th >Value</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <DataRow data={{ title: "Token", value: token }} />
                                                    <DataRow data={{ title: "Offer Type", value: getOfferType(offerType) }} />
                                                    <DataRow data={{ title: "Minimum Amount", value: min_amt }} />
                                                    <DataRow data={{ title: "Maximum Amount", value: max_amt }} />
                                                    <DataRow data={{ title: "Offer Rate", value: `${offerRate} %` }} />
                                                    <DataRow data={{ title: "Payment Method", value: payment }} />
                                                    <DataRow data={{ title: "Currency", value: currency }} />
                                                </tbody>
                                            </Table>

                                            <Text my="md">
                                                <strong>N/B:- {getMessage(offerType, offerRate)}</strong>
                                            </Text>
                                        </Paper>
                                    </ScrollArea>
                                </Paper>
                            </Stepper.Step>
                        </Stepper>
                        <div className="custom-card py-2 my-2">
                            <Group position="center" my={"sm"}>
                                <MButton variant="outlined"
                                    onClick={prevStep}
                                    radius="xl"
                                    leftIcon={<IconArrowLeft />}
                                    disabled={active === 0 ? true : false} color="violet"
                                    style={{ width: "120px", height: "42px" }}
                                >
                                    Back
                                </MButton>
                                <MButton variant="contained" onClick={e => {
                                    if (active < 5) {
                                        nextStep()
                                    }
                                    else {
                                        openConfirmModal()
                                    }
                                }} rightIcon={active === 4 ? <IconArrowRight /> : active === 5 ? <IconCurrencyDollar /> : <IconCurrencyDollar />}
                                    color="violet"
                                    style={{ width: "120px", height: "42px" }}
                                    radius="xl"
                                >
                                    {
                                        active === 5 ? "Finish" : active === 5 ? "Create Offer" : "Next"
                                    }
                                </MButton>
                                {
                                    loading && (
                                        <Loader variant='oval' />
                                    )
                                }
                            </Group>
                        </div>
                    </div>
                </>
            </Paper>
        </Container>
    )
}

export default CreateOffer