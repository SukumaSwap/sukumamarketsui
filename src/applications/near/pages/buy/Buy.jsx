import React, { forwardRef, useEffect, useState } from 'react'
import { Avatar, Button, Center, Grid, Group, Paper, ScrollArea, Table, Text, Select } from '@mantine/core'
import { getCurrency, getTextCount } from '../../../../app/appFunctions';
import { useNavigate } from 'react-router-dom';
import { NEAR_OBJECT } from '../../../../app/appconfig';
import { getTokenPrice, SukMarketViewFunctionCall } from '../../../../app/nearutils';
import NearBuyRow from './NearBuyRow';
import TokenBuyRow from './TokenBuyRow';
import SelectTokenModal from '../../modals/SelectTokenModal';
import SelectCurrencyModal from '../../modals/SelectCurrencyModal';
import SelectPaymentMethodModal from '../../modals/SelectPaymentMethodModal';


const PaymentSelectOne = forwardRef((props, ref) => (
    <div ref={ref} {...props}>
        <Group noWrap>
            <img src={props.icon} height="20px" alt={props?.name} />
            <div>
                <Text size="sm">{props?.label}</Text>
            </div>
        </Group>
    </div>
));


const Buy = () => {
    const [offers, setOffers] = useState([])
    const [tokenOffers, setTokenOffers] = useState([])
    const [currencies, setCurrencies] = useState([])
    const [payments, setPayments] = useState([])

    const [loading, setLoading] = useState(false)

    const [tokenPrice, setTokenPrice] = useState(null)


    const [selectedToken, setSelectedToken] = useState(NEAR_OBJECT)
    const [modalOpen, setModalOpen] = useState(false) // Token modal

    const [selectedPayment, setSelectedPayment] = useState({
        name: "M-Pesa",
        icon: ""
    }) 
    const [selectedCurrency, setSelectedCurrency] = useState(getCurrency('KES'))
    const [currencyModalOpen, setCurrencyModalOpen] = useState(false)
    const [methodsModalOpen, setMethodsModalOpen] = useState(false)

    const navigate = useNavigate()

    const goTo = (url) => {
        navigate(url)
    }

    const loadNearOffers = () => {
        const contract = window.contract
        const wallet = window.walletConnection
        if (contract && wallet) {
            SukMarketViewFunctionCall(wallet, {
                methodName: "get_sell_offers",
                args: {}
            }).then(res => {
                setOffers(res)
            }).catch(err => {
                console.log("Fetching tokens error", err)
            })
        }
    }

    const loadTokenOffers = () => {
        const wallet = window.walletConnection
        if (wallet) {
            setLoading(true)
            SukMarketViewFunctionCall(wallet, {
                methodName: "get_sell_token_offers_by_token",
                args: {
                    token: selectedToken?.address
                }
            }).then(res => {
                setTokenOffers(res)
            }).catch(err => {
                console.log("Fetching tokens error", err)
            })
        }
    }

    const rows = offers.map((offer, index) => (
        <NearBuyRow key={`${offer.id}`} offer={offer} tokenprice={tokenPrice} />
    ))

    const token_rows = tokenOffers.map((offer, index) => (
        <TokenBuyRow key={`${offer.id}`} offer={offer} tokenprice={tokenPrice} />
    ))

    const getTokenRate = () => {
        if (selectedToken?.address === "near") {
            getTokenPrice("wrap.testnet").then(res => {
                setTokenPrice(res?.price)
            }).catch(err => {
                console.log("Token price error", err)
            })
        }
        else {
            getTokenPrice(selectedToken?.address).then(res => {
                setTokenPrice(res?.price)
            }).catch(err => {
                console.log("Token price error", err)
            })
        }
    }

    const selectToken = (token) => {
        setSelectedToken(token)
    }

    const selectCurrency = (cur) => {
        setSelectedCurrency(cur)
    }

    const selectMethod = (method) => {
        setSelectedPayment(method)
    }

    const getPayments = () => {
        const wallet = window.walletConnection
        const contract = window.contract
        if (wallet && contract) {
            SukMarketViewFunctionCall(wallet, {
                methodName: "get_payments",
                args: {}
            }).then(res => {
                setPayments(res)
            }).catch(err => {
                console.log("Fetching payments error", err)
            })
        }
    }

    const loadOffers = () => {
        if (selectedToken?.address === "near") {
            loadNearOffers()
        }
        else {
            loadTokenOffers()
        }
    }

    const closeModal = () => {
        setModalOpen(false)
    }

    useEffect(() => {
        getPayments()
    }, [])

    useEffect(() => {
        getTokenRate()
        loadOffers()
    }, [selectedToken, selectedPayment, selectedCurrency])

    return (
        <Paper pt="md" radius="lg" sx={theme => ({
            background: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[2]
        })}>
            <SelectTokenModal open={modalOpen} select={selectToken} closeModal={closeModal} selectedToken={selectedToken} />
            <SelectCurrencyModal open={currencyModalOpen} select={selectCurrency} closeModal={() => setCurrencyModalOpen(false)} selected={selectedCurrency} />
            <SelectPaymentMethodModal open={methodsModalOpen} select={selectMethod} closeModal={() => setMethodsModalOpen(false)} selected={selectedPayment} />

            <Grid mb="xl" mt="md">
                <Grid.Col xs={4} md={4}>
                    <Center style={{
                        height: "100%"
                    }}>
                        <Button onClick={e => setModalOpen(true)} variant="default" px="xl" radius="xl">
                            <Group>
                                <Avatar style={{ overflow: "hidden" }} size="sm" radius="xl" src={selectedToken?.icon} />
                                <Text><b>{selectedToken?.symbol}</b></Text>
                            </Group>
                        </Button>
                    </Center>
                </Grid.Col>
                <Grid.Col xs={4} md={4}>
                    <Center style={{
                        height: "100%"
                    }}>
                        <Button onClick={e => setMethodsModalOpen(true)} variant="default" px="xl" radius="xl">
                            <Group>
                                <Avatar style={{ overflow: "hidden" }} size="sm" radius="xl" src={selectedPayment?.icon}>
                                    {selectedPayment?.name?.substring(0, 1)}
                                </Avatar>
                                <Text><b>{selectedPayment?.name}</b></Text>
                            </Group>
                        </Button>
                    </Center>
                </Grid.Col>
                <Grid.Col xs={4} md={4}>
                    <Center style={{
                        height: "100%"
                    }}>
                        <Button onClick={e => setCurrencyModalOpen(true)} variant="default" px="xl" radius="xl">
                            <Group>
                                <Avatar radius="xl">
                                    {selectedCurrency?.symbol}
                                </Avatar>
                                <Text><b>{getTextCount(selectedCurrency?.name || "Select Currency", 15)}</b></Text>
                            </Group>
                        </Button>
                    </Center>
                </Grid.Col>
            </Grid>

            <Paper py="md" radius="lg" sx={theme => ({
                background: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[1]
            })}>
                <ScrollArea>
                    <Table verticalSpacing={10} style={{
                        padding: "10px",
                        borderCollapse: "collapse !important"
                    }}>

                        <thead>
                            <tr>
                                <th className='custom-td'>Buy From</th>
                                <th className='custom-td'>Limits</th>
                                <th className='custom-td'>Payment</th>
                                <th className='custom-td'>Currency</th>
                                <th className='custom-td'>Rate</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                selectedToken && selectedToken?.address === "near" && rows
                            }
                            {
                                selectedToken && selectedToken?.address !== "near" && token_rows
                            }
                        </tbody>
                    </Table>
                </ScrollArea>
            </Paper>
        </Paper>
    )
}

export default Buy