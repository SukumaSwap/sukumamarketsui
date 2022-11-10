import React, { forwardRef, useEffect, useState } from 'react'
import { Avatar, Button, Center, Grid, Group, Paper, Popover, ScrollArea, Table, TextInput, Text, Select, Stack, NavLink, useMantineTheme } from '@mantine/core'
import { getCurrency, getTextCount, getTheme } from '../../../../app/appFunctions';
import { IconArrowDown, IconArrowUp, IconCheck, IconChevronDown } from '@tabler/icons';
import { Link, useNavigate } from 'react-router-dom';
import { CONTRACT, NEAR_OBJECT } from '../../../../app/appconfig';
import { getReadableTokenBalance, getTokenPrice } from '../../../../app/nearutils';
import NearSellRow from './NearSellRow';
import TokenSellRow from './TokenSellRow';
import SelectTokenModal from '../../modals/SelectTokenModal';
import SelectCurrencyModal from '../../modals/SelectCurrencyModal';



const PaymentSelect = forwardRef((props, ref) => (
    <div ref={ref} {...props}>
        <Group noWrap>
            <Avatar src={props.icon} size="sm" className='text-capitalize'>{props.label && props.label[0]}</Avatar>
            <div>
                <Text size="sm">{props.label}</Text>
                {props.symbol &&
                    <Text size="xs" color="dimmed">
                        {props.symbol} - <small>{props.address}</small>
                    </Text>
                }
            </div>
        </Group>
    </div>
));

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


const Sell = () => {
    const [offers, setOffers] = useState([])
    const [tokenOffers, setTokenOffers] = useState([])
    const [tokens, setTokens] = useState([])
    const [payments, setPayments] = useState([])

    const [loading, setLoading] = useState(false)

    const [tokenPrice, setTokenPrice] = useState(null)

    const [selectedToken, setSelectedToken] = useState(NEAR_OBJECT)
    const [selectedPayment, setSelectedPayment] = useState("M-Pesa")
    const [selectedCurrency, setSelectedCurrency] = useState(getCurrency('KES'))

    const [modalOpen, setModalOpen] = useState(false) //Token modal

    const [currencyModalOpen, setCurrencyModalOpen] = useState(false)

    const navigate = useNavigate()

    const goTo = (url) => {
        navigate(url)
    }

    const loadNearOffers = () => {
        const contract = window.contract
        const wallet = window.walletConnection
        if (contract && wallet) {
            wallet.account().viewFunction(CONTRACT, "get_buy_offers", {}).then(res => {
                setOffers(res)
            }).catch(err => {
                console.log("Fetching tokens error", err)
            })
        }
    }

    const loadTokenOffers = () => {
        const contract = window.contract
        const wallet = window.walletConnection
        if (wallet) {
            setLoading(true)
            //   contract.get_sell_token_offers_by_token({ token: selectedToken }).then(res => {
            //     setOffers(res)
            //     console.log(res)
            //   }).catch(err => {
            //     console.log(err)
            //   }).finally(() => {
            //     setLoading(false)
            //   })
            wallet.account().viewFunction(CONTRACT, "get_buy_token_offers_by_token", { token: selectedToken?.address }).then(res => {
                setTokenOffers(res)
            }).catch(err => {
                console.log("Fetching tokens error", err)
            })
        }
    }

    const rows = offers.map((offer, index) => (
        <NearSellRow key={`${offer.id}`} offer={offer} tokenprice={tokenPrice} />
    ))

    const token_rows = tokenOffers.map((offer, index) => (
        <TokenSellRow key={`${offer.id}`} offer={offer} tokenprice={tokenPrice} />
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
        getTokens()
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
            <SelectTokenModal open={modalOpen} tokens={tokens} select={selectToken} closeModal={closeModal} selectedToken={selectedToken} />
            <SelectCurrencyModal open={currencyModalOpen} select={selectCurrency} closeModal={() => setCurrencyModalOpen(false)} selected={selectedCurrency} />
            
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
                        <Select
                            // label="Choose Payment Method"
                            placeholder="Payment Method"
                            value={selectedPayment}
                            onChange={val => setSelectedPayment(val)}
                            itemComponent={PaymentSelectOne}
                            data={[...payments.map(payment => ({ value: payment.name, label: payment.name }))]}
                            searchable
                            maxDropdownHeight={400}
                            nothingFound="Method Not Found"
                            filter={(value, item) =>
                                item.label.toLowerCase().includes(value.toLowerCase().trim())
                            }
                        />
                    </Center>
                </Grid.Col>
                <Grid.Col xs={4} md={4}>
                    <Center style={{
                        height: "100%"
                    }}>
                       <Button onClick={e => setCurrencyModalOpen(true)} variant="default" px="xl" radius="xl">
                            <Group>
                                <Avatar sx={theme => ({
                                    background: theme.fn.linearGradient(45, 'red', 'blue'),
                                    ".mantine-Avatar-placeholder": {
                                        background: "transparent"
                                    }
                                })} size="md" radius="xl">
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

export default Sell