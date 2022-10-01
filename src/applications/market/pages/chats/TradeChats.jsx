import { Avatar, Button, Group, Paper, Popover, ScrollArea, Table, Text, NavLink, Title, Checkbox } from '@mantine/core'
import React, { forwardRef, useState } from 'react'
import { convertNstoTime, getTextCount, getTheme } from '../../../../app/appFunctions';
import { IconCheck, IconChevronDown, IconMessageDots, IconX } from '@tabler/icons';
import { Link, useNavigate } from 'react-router-dom';
import { CONTRACT, NEAR_OBJECT } from '../../../../app/appconfig';
import { useEffect } from 'react';
import parse from "html-react-parser"
import { getReadableTokenBalance } from '../../../../app/nearutils';
import NearChatRow from './NearChatRow';
import TokenChatRow from './TokenChatRow';

const offers = [
    {
        id: "offer-1",
        offerer: 'dalmasonto.testnet',
        max: '140',
        min: '30',
        token: {
            title: 'Near',
            icon: '',
            asset: 'near',
        },
        payment: {
            id: "bank",
            title: "Bank",
            icon: ''
        },
        currency: 'KES',
        rate: -1
    },
    {
        id: "offer-2",
        offerer: 'dalmasonto.testnet',
        max: '100',
        min: '30',
        token: {
            title: 'Near',
            icon: '',
            asset: 'near',
        },
        payment: {
            id: "m-pesa",
            title: "M-Pesa",
            icon: ''
        },
        currency: 'KES',
        rate: -1
    }
]

const paymentMethods = [
    {
        icon: "",
        label: "M-Pesa",
        value: "m-pesa",
        symbol: null
    }
]

const currencies = [
    {
        icon: "",
        label: "KES",
        value: "kes",
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


const Asset = ({ }) => {
    return (
        <Group sx={theme => ({
            border: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.gray[6] : theme.colors.gray[5]}`,
            borderRadius: theme.radius.md,
            padding: '2px 4px',
            cursor: "pointer",
            ":hover": {

            }
        })}>
            <Avatar />
            <Text>Near</Text>
        </Group>
    )
}

const tableHeaders = [
    {
        value: 'offer_id',
        label: 'Offer',
        show: false
    },
    {
        value: 'message',
        label: 'Message',
        show: true
    },
    {
        value: 'chat',
        label: 'Chat',
        show: true
    },
    {
        value: 'token',
        label: 'Token',
        show: true
    },
    {
        value: 'owner',
        label: 'Chat Creator',
        show: true
    },
    {
        value: 'offerer',
        label: 'Offerer',
        show: false
    },
    {
        value: 'amount',
        label: 'Amount',
        show: true
    },
    {
        value: 'active',
        label: 'Status',
        show: false
    },
    {
        value: 'payer',
        label: 'Payer',
        show: true
    },
    {
        value: 'receiver',
        label: 'Receiver',
        show: true
    },
    {
        value: 'paid',
        label: 'Paid',
        show: false
    },
    {
        value: 'received',
        label: 'Received',
        show: false
    },
    {
        value: 'canceled',
        label: 'Canceled',
        show: false
    },
    {
        value: 'released',
        label: 'Released',
        show: false
    },
    {
        value: 'payer_has_rated',
        label: 'Payer Rated',
        show: false
    },
    {
        value: 'receiver_has_rated',
        label: 'Receiver Rated',
        show: false
    },
    {
        value: 'started_at',
        label: 'Started At',
        show: true
    },
    {
        value: 'ended_at',
        label: 'Ended At',
        show: false
    },
]

const trades = [
    {
        id: "someid",
        offer_id: 'offer_id',
        message: "dalmasonto.testnet to pay alexmatu.testnet kes 3000 for 2.14 Near",
        token: 'wrap.testnet',
        owner: 'alexmatu.testnet',
        offerer: 'near',
        amount: 3232423432,
        active: false,
        payer: 'dalmasonto.testner',
        receiver: 'alexmatu.testnet',
        paid: true,
        received: false,
        canceled: true,
        released: false,
        payer_has_rated: false,
        receiver_has_rated: false,
        started_at: 42434324,
        ended_at: 424243243
    }
]



const SelectTableHeaders = ({ headers, selectHeader }) => {
    return (
        <Popover width={250} position="bottom" withArrow shadow="md" radius="md">
            <Popover.Target>
                <Button rightIcon={<IconChevronDown />} radius="xl" color="gray">Select Columns</Button>
            </Popover.Target>
            <Popover.Dropdown px={0}>
                <ScrollArea style={{
                    height: "400px"
                }}>
                    <Paper px="sm" style={{
                        background: "transparent"
                    }} >
                        {
                            headers.map((header, index) => (

                                <Group key={header.value} position='apart' sx={theme => ({
                                    width: "100% !important",
                                    background: getTheme(theme) ? theme.colors.dark[4] : theme.colors.gray[2],
                                    borderRadius: theme.radius.md,
                                    padding: '6px 16px',
                                    margin: "10px 0",
                                    cursor: "pointer"
                                })} onClick={e => {
                                    selectHeader(header.value, !header.show)
                                }}>
                                    <Text>{header.label}</Text>
                                    <Checkbox checked={header.show} readOnly />
                                </Group>
                            ))
                        }
                    </Paper>
                </ScrollArea>
            </Popover.Dropdown>
        </Popover>
    );
}


const TradeChats = () => {

    const [headers, setHeaders] = useState(tableHeaders)

    const [loading, setLoading] = useState(false)
    const [chats, setChats] = useState([])
    const [tokenChats, setTokenChats] = useState([])

    const navigate = useNavigate()

    const goTo = (url) => {
        navigate(url)
    }

    const getHeader = (value) => {
        return headers.find(header => header.value === value)
    }

    const rows = chats.map((obj, index) => (
        <NearChatRow key={`near_chat_row_${index}`} obj={obj} getHeader={getHeader} />
    ))
    const tokenrows = tokenChats.map((obj, index) => (
        <TokenChatRow key={`token_chat_row_${index}`} obj={obj} getHeader={getHeader} />
    ))

    const selectHeader = (value, show) => {
        const headers_ = [...headers]
        headers_.forEach(header => {
            if (header.value === value) {
                header.show = show
            }
        })
        setHeaders(headers_)
    }

    const loadChats = () => {
        setLoading(true)
        console.log("loading chats")
        const contract = window.contract
        const wallet = window.walletConnection
        if (contract && wallet) {
            wallet.account().viewFunction(CONTRACT, "get_account_chats", { account_id: wallet.getAccountId() }).then(res => {
                console.log("have been reached", res)
                if (typeof res === 'object') {
                    setChats(res)
                }
                else {
                    alert(res)
                }
            }).catch(err => {
                console.log("Fetching near chats error", err)
            })
        }
    }

    const loadTokenChats = () => {
        setLoading(true)
        const contract = window.contract
        const wallet = window.walletConnection
        if (contract && wallet) {
            wallet.account().viewFunction(CONTRACT, "get_token_account_chats", { account_id: wallet.getAccountId() }).then(res => {
                if (typeof res === 'object') {
                    setTokenChats(res)
                }
                else {
                    alert(res)
                }
            }).catch(err => {
                console.log("Fetching near chats error", err)
            })
        }
    }

    useEffect(() => {
        loadChats()
        loadTokenChats()
    }, [])

    return (
        <Paper pt="md" radius="lg" sx={theme => ({
            background: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[2]
        })}>

            <Group position='apart' px="md" mb="md">
                <Title>Trade</Title>
                <SelectTableHeaders headers={headers} selectHeader={selectHeader} />
            </Group>

            <Paper py="md" radius="lg" px="sm" sx={theme => ({
                background: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[1]
            })}>
                <ScrollArea>
                    <Table verticalSpacing={10} style={{
                        padding: "10px",
                        borderCollapse: "collapse !important"
                    }}>


                        <thead>
                            <tr>
                                {
                                    headers.map((header, i) => {
                                        if (header.show) {
                                            return (
                                                <th key={`chat_table_heads_${i}`} className='custom-td'>{header.label}</th>
                                            )
                                        }
                                    })
                                }
                            </tr>
                        </thead>
                        <tbody>
                            {rows}
                            {tokenrows}
                        </tbody>
                    </Table>
                </ScrollArea>
            </Paper>
        </Paper>
    )
}

export default TradeChats