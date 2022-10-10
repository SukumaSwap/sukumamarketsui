import React, { forwardRef, useEffect, useState } from 'react'
import { Avatar, Button, Center, Grid, Group, Paper, Popover, ScrollArea, Table, TextInput, Text, Select, Stack, NavLink, useMantineTheme } from '@mantine/core'
import { getTextCount, getTheme } from '../../../../app/appFunctions';
import { IconArrowDown, IconArrowUp, IconCheck, IconChevronDown } from '@tabler/icons';
import { Link, useNavigate } from 'react-router-dom';
import { CONTRACT, NEAR_OBJECT } from '../../../../app/appconfig';
import { getReadableTokenBalance, getTokenPrice } from '../../../../app/nearutils';
import NearSellRow from './NearSellRow';
import TokenSellRow from './TokenSellRow';
import SelectTokenModal from '../../modals/SelectTokenModal';



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
    const [currencies, setCurrencies] = useState([])
    const [payments, setPayments] = useState([])

    const [loading, setLoading] = useState(false)

    const [tokenPrice, setTokenPrice] = useState(null)

    const [selectedToken, setSelectedToken] = useState(NEAR_OBJECT)
    const [selectedPayment, setSelectedPayment] = useState("M-Pesa")
    const [selectedCurrency, setSelectedCurrency] = useState("KES")

    const [searchedToken, setSearchedToken] = useState('')
    const [modalOpen, setModalOpen] = useState(false)


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
        getCurrencies()
        getPayments()
    }, [])

    useEffect(() => {
        getTokenRate()
        loadOffers()
    }, [selectedToken, selectedPayment, selectedCurrency])

    console.log(selectedToken)

    return (
        <Paper pt="md" radius="lg" sx={theme => ({
            background: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[2]
        })}>
            <SelectTokenModal open={modalOpen} tokens={tokens} select={selectToken} closeModal={closeModal} selectedToken={selectedToken} />
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
                        {/* <Popover width={400} position="bottom" shadow="md" radius="lg">
                            <Popover.Target>
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
                        </Popover> */}
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