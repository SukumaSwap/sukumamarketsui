import { Avatar, Button, Group, Paper, Popover, ScrollArea, Table, Text, NavLink, Title, Checkbox } from '@mantine/core'
import React, { forwardRef, useState } from 'react'
import { getTextCount, getTheme } from '../../../../app/appFunctions';
import { IconArrowUp, IconCheck, IconChevronDown, IconX } from '@tabler/icons';
import { Link, useNavigate } from 'react-router-dom';
import { CONTRACT, NEAR_OBJECT } from '../../../../app/appconfig';
import { useMemo } from 'react';
import { getReadableTokenBalance } from '../../../../app/nearutils';

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
        value: 'offer_type',
        label: 'Offer Type',
        show: true
    },
    {
        value: 'offerer',
        label: 'Offerer',
        show: false
    },
    {
        value: 'min_amount',
        label: 'Min Amount',
        show: false
    },
    {
        value: 'max_amount',
        label: 'Max Amount',
        show: false
    },
    {
        value: 'offer_rate',
        label: 'Offer rate',
        show: true
    },
    {
        value: 'active',
        label: 'Active',
        show: true
    },
    {
        value: 'payment',
        label: 'Payment',
        show: true
    },
    {
        value: 'currency',
        label: 'Currency',
        show: true
    },
    {
        value: 'created_on',
        label: 'Created On',
        show: false
    },
]

const offers_ = [
    {
        id: "someid",
        offer_type: 'buy',
        offerer: 'alexmatu.testnet',
        min_amount: '200',
        max_amount: '300',
        token: 'near',
        offer_rate: 1,
        active: true,
        payment: 'M-Pesa',
        currency: 'KES',
        created_on: 213242342343,
    }
]



const SelectTableHeaders = ({ headers, selectHeader }) => {
    return (
        <Popover width={200} position="bottom" withArrow shadow="md" radius="md">
            <Popover.Target>
                <Button rightIcon={<IconChevronDown />} radius="xl" color="gray">Select Columns</Button>
            </Popover.Target>
            <Popover.Dropdown>
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
            </Popover.Dropdown>
        </Popover>
    );
}


const Offers = () => {

    const [headers, setHeaders] = useState(tableHeaders)
    const [offers, setOffers] = useState([])

    const navigate = useNavigate()

    const goTo = (url) => {
        navigate(url)
    }

    const getHeader = (value) => {
        return headers.find(header => header.value === value)
    }

    const rows = offers.map((obj, index) => (
        <tr key={`${obj?.id}`}>
            {
                getHeader("offer_type")?.show && (
                    <td>
                        <Text style={{ textTransform: "capitalize" }}>{obj.offer_type}</Text>
                    </td>
                )
            }
            {
                getHeader("offerer")?.show && (
                    <td>
                        <NavLink px={0} label={getTextCount(obj.offerer, 20)} to={`/near/accounts/${obj.offerer}`} component={Link} />
                    </td>
                )
            }
            {
                getHeader("min_amount")?.show && (
                    <td>
                        <Group>
                            <Avatar src={NEAR_OBJECT.icon} />
                            <Text>
                                {
                                    getReadableTokenBalance(obj?.min_amount, 24)
                                }
                            </Text>
                        </Group>
                    </td>
                )
            }
            {
                getHeader("max_amount")?.show && (
                    <td>
                        <Group>
                            <Avatar src={NEAR_OBJECT.icon} />
                            <Text>
                                {
                                    getReadableTokenBalance(obj?.max_amount, 24)
                                }
                            </Text>
                        </Group>
                    </td>
                )
            }
            {
                getHeader("token")?.show && (
                    <td>
                        <Text>{obj.token}</Text>
                    </td>
                )
            }
            {
                getHeader("offer_rate")?.show && (
                    <td>
                        <Text>{obj.offer_rate}</Text>
                    </td>
                )
            }
            {
                getHeader("active")?.show && (
                    <td>
                        <Text>{obj.active ? <IconCheck color='green' /> : <IconX color="red" />}</Text>
                    </td>
                )
            }
            {
                getHeader("payment")?.show && (
                    <td>
                        <Text style={{ textTransform: "capitalize" }}>{obj.payment}</Text>
                    </td>
                )
            }
            {
                getHeader("currency")?.show && (
                    <td>
                        <Text>{obj.currency}</Text>
                    </td>
                )
            }
            {
                getHeader("created_on")?.show && (
                    <td>
                        <Text>{obj.created_on}</Text>
                    </td>
                )
            }
        </tr>
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

    const loadNearOffers = () => {
        const contract = window.contract
        const wallet = window.walletConnection
        if (contract && wallet) {
            wallet.account().viewFunction(CONTRACT, "get_account_offers", { "account_id": wallet.getAccountId() }).then(res => {
                setOffers(res)
            }).catch(err => {
                console.log("Fetching offers error", err)
            })
        }
    }

    useMemo(() => {
        loadNearOffers()
    }, [])

    return (
        <Paper pt="md" radius="lg" sx={theme => ({
            background: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[2]
        })}>

            <Group position='apart' px="md" mb="md">
                <Title>Offers</Title>
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
                                    headers.map((header, index) => {
                                        if (header.show) {
                                            return (
                                                <th key={`offer_header_${header.value}`} className='custom-td'>{header.label}</th>
                                            )
                                        }
                                    })
                                }
                            </tr>
                        </thead>
                        <tbody>
                            {rows}
                        </tbody>
                    </Table>
                </ScrollArea>
            </Paper>
        </Paper>
    )
}

export default Offers