import { Avatar, Button, Group, Paper, Popover, ScrollArea, Table, Text, NavLink, Title, Checkbox } from '@mantine/core'
import React, { forwardRef, useState } from 'react'
import { getTextCount, getTheme } from '../../../../app/appFunctions';
import { IconChevronDown } from '@tabler/icons';
import { Link, useNavigate } from 'react-router-dom';

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
        value: 'sender',
        label: 'Sender',
        show: true
    },
    {
        value: 'receiver',
        label: 'Receiver',
        show: true
    },
    {
        value: 'token',
        label: 'Token',
        show: true
    },
    {
        value: 'amount',
        label: 'Amount',
        show: true
    },
    {
        value: 'timestamp',
        label: 'Created On',
        show: true
    },
]

const trades = [
    {
        id: "someid",
        sender: 'dalmasonto.testnet',
        receiver: 'alexmatu.testnet',
        amount: '200',
        token: 'near',
        timestamp: 3232423432,
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


const Transfers = () => {

    const [headers, setHeaders] = useState(tableHeaders)

    const navigate = useNavigate()

    const goTo = (url) => {
        navigate(url)
    }

    const getHeader = (value) => {
        return headers.find(header => header.value === value)
    }

    const rows = trades.map((obj, index) => (
        <tr key={`${obj?.id}`}>
            {
                getHeader("sender")?.show && (
                    <td>
                        <NavLink px={0} label={getTextCount(obj.sender, 20)} to={`/market/accounts/${obj.receiver}`} component={Link} />
                    </td>
                )
            }
            {
                getHeader("receiver")?.show && (
                    <td>
                        <NavLink px={0} label={getTextCount(obj.receiver, 20)} to={`/market/accounts/${obj.receiver}`} component={Link} />
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
                getHeader("amount")?.show && (
                    <td>
                        <Text style={{ textTransform: "capitalize" }}>{obj.amount}</Text>
                    </td>
                )
            }
            {
                getHeader("timestamp")?.show && (
                    <td>
                        <Text style={{ textTransform: "capitalize" }}>{obj.timestamp}</Text>
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
    return (
        <Paper pt="md" radius="lg" sx={theme => ({
            background: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[2]
        })}>

            <Group position='apart' px="md" mb="md">
                <Title>Transfers</Title>
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
                                                <th className='custom-td'>{header.label}</th>
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

export default Transfers