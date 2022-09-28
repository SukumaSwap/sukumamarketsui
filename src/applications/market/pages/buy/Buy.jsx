import React, { forwardRef, useEffect, useState } from 'react'
import { Avatar, Button, Center, Grid, Group, Paper, Popover, ScrollArea, Table, TextInput, Text, Select, Stack, NavLink, useMantineTheme } from '@mantine/core'
import { getTextCount, getTheme } from '../../../../app/appFunctions';
import { IconArrowDown, IconArrowUp, IconCheck, IconChevronDown } from '@tabler/icons';
import { Link, useNavigate } from 'react-router-dom';
import { CONTRACT, NEAR_OBJECT } from '../../../../app/appconfig';
import { getReadableTokenBalance, getTokenPrice } from '../../../../app/nearutils';
import NearBuyRow from './NearBuyRow';
import TokenBuyRow from './TokenBuyRow';

// const offers = [
//     {
//         id: "offer-1",
//         offerer: 'dalmasonto.testnet',
//         max: '140',
//         min: '30',
//         token: {
//             title: 'Near',
//             icon: '',
//             asset: 'near',
//         },
//         payment: {
//             id: "bank",
//             title: "Bank",
//             icon: ''
//         },
//         currency: 'KES',
//         rate: -1
//     },
//     {
//         id: "offer-2",
//         offerer: 'dalmasonto.testnet',
//         max: '100',
//         min: '30',
//         token: {
//             title: 'Near',
//             icon: '',
//             asset: 'near',
//         },
//         payment: {
//             id: "m-pesa",
//             title: "M-Pesa",
//             icon: ''
//         },
//         currency: 'KES',
//         rate: -1
//     }
// ]

const paymentMethods = [
    {
        icon: "",
        label: "M-Pesa",
        value: "M-Pesa",
        symbol: null
    }
]

const currencies = [
    {
        icon: "",
        label: "KES",
        value: "KES",
        symbol: null
    }
]


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
                <Text size="sm">{props?.name}</Text>
            </div>
        </Group>
    </div>
));


const Asset = ({ asset, selected, select }) => {
    const theme = useMantineTheme()
    return (
        <Group sx={theme => ({
            borderWidth: "1px",
            borderStyle: "solid",
            borderColor: selected === asset?.address ? theme.colors.blue[6] : getTheme(theme) ? theme.colors.gray[6] : theme.colors.dark[1],
            borderRadius: theme.radius.xl,
            padding: '2px 4px',
            cursor: "pointer",
            ":hover": {
            }
        })} onClick={e => select && select(asset.address)}>
            <Avatar src={asset?.icon} />
            <Text color={selected === asset?.address ? theme.colors.blue[6] : getTheme(theme) ? theme.colors.gray[2] : theme.colors.dark[5]}>{asset?.name}</Text>
            <IconCheck color={selected === asset?.address ? theme.colors.blue[6] : "transparent"} />
        </Group>
    )
}

const Buy = () => {
    const [offers, setOffers] = useState([])
    const [tokenOffers, setTokenOffers] = useState([])
    const [tokens, setTokens] = useState([])
    const [currencies, setCurrencies] = useState([])
    const [payments, setPayments] = useState([])

    const [loading, setLoading] = useState(false)

    const [tokenPrice, setTokenPrice] = useState(null)

    const [selectedToken, setSelectedToken] = useState("near")
    const [selectedPayment, setSelectedPayment] = useState("M-Pesa")
    const [selectedCurrency, setSelectedCurrency] = useState("KES")

    const [searchedToken, setSearchedToken] = useState('')


    const navigate = useNavigate()

    const goTo = (url) => {
        navigate(url)
    }

    const loadNearOffers = () => {
        const contract = window.contract
        const wallet = window.walletConnection
        if (contract && wallet) {
            wallet.account().viewFunction(CONTRACT, "get_sell_offers", {}).then(res => {
                setOffers(res)
            }).catch(err => {
                console.log("Fetching tokens error", err)
            })
        }
    }

    const loadTokenOffers = () => {
        const contract = window.contract
        const wallet = window.walletConnection
        if ( wallet) {
            setLoading(true)
            //   contract.get_sell_token_offers_by_token({ token: selectedToken }).then(res => {
            //     setOffers(res)
            //     console.log(res)
            //   }).catch(err => {
            //     console.log(err)
            //   }).finally(() => {
            //     setLoading(false)
            //   })
            wallet.account().viewFunction(CONTRACT, "get_sell_token_offers_by_token", {token: selectedToken }).then(res => {
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
        if (selectedToken === "near") {
            getTokenPrice("wrap.testnet").then(res => {
                setTokenPrice(res?.price)
            }).catch(err => {
                console.log("Token price error", err)
            })
        }
        else {
            getTokenPrice(selectedToken).then(res => {
                setTokenPrice(res?.price)
            }).catch(err => {
                console.log("Token price error", err)
            })
        }
    }

    const selectToken = (address) => {
        setSelectedToken(address)
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

    const filterTokens = () => {
        const filteredTokens = tokens.filter(token => {
            const regex = new RegExp(searchedToken, 'i');
            return token.symbol.match(regex) || token.name.match(regex) || token.address.match(regex)
        })
        return filteredTokens
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

    const loadOffers = () => {
        if (selectedToken === "near") {
            loadNearOffers()
        }
        else {
            loadTokenOffers()
        }
    }

    useEffect(() => {
        getTokens()
        getCurrencies()
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

            <Grid mb="xl" mt="md">
                <Grid.Col xs={4} md={4}>
                    <Center style={{
                        height: "100%"
                    }}>
                        <Popover width={400} position="bottom" shadow="md" radius="lg">
                            <Popover.Target>
                                <Button rightIcon={<IconChevronDown />} variant="default" px="xl">Asset - {selectedToken}</Button>
                            </Popover.Target>
                            <Popover.Dropdown>
                                <TextInput radius="xl" value={searchedToken} onChange={e => setSearchedToken(e.target.value)} type="search" placeholder='Search by name | symbol | address' />
                                <Group align="center" position='center' py="xs">
                                    <Asset asset={{ ...NEAR_OBJECT, address: "near" }} selected={selectedToken} select={selectToken} />
                                    {
                                        filterTokens().map((token_, index) => {
                                            return (
                                                <Asset key={`buy_token_${index}`} asset={token_} selected={selectedToken} select={selectToken} />
                                            )
                                        })
                                    }
                                </Group>
                            </Popover.Dropdown>
                        </Popover>
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
                        <Select
                            // label="Choose Currency"
                            placeholder="Currency"
                            value={selectedCurrency}
                            onChange={val => setSelectedCurrency(val)}
                            itemComponent={PaymentSelect}
                            data={currencies}
                            searchable
                            maxDropdownHeight={400}
                            nothingFound="Currency Not Found"
                            filter={(value, item) =>
                                value.toLowerCase().includes(value.toLowerCase().trim())
                            }
                        />
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
                                selectedToken && selectedToken === "near" && rows
                            }
                            {
                                selectedToken && selectedToken !== "near" && token_rows
                            }
                        </tbody>
                    </Table>
                </ScrollArea>
            </Paper>
        </Paper>
    )
}

export default Buy