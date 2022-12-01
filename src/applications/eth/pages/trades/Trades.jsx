import { Avatar, Button, Group, Paper, Popover, ScrollArea, Table, Text, NavLink, Title, Checkbox } from '@mantine/core'
import React, { forwardRef, useEffect, useState } from 'react'
import { getTextCount, getTheme } from '../../../../app/appFunctions';
import { IconChevronDown } from '@tabler/icons';
import { Link, useNavigate } from 'react-router-dom';

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
        value: 'trade_type',
        label: 'Type',
        show: true
    },
    {
        value: 'buyer',
        label: 'Buyer',
        show: true
    },
    {
        value: 'seller',
        label: 'Seller',
        show: true
    },
    {
        value: 'amount',
        label: 'Amount',
        show: true
    },
    {
        value: 'token_id',
        label: 'Token',
        show: false
    },
    {
        value: 'start_timestamp',
        label: 'Started At',
        show: false
    },
    {
        value: 'end_timestamp',
        label: 'Ended At',
        show: false
    },
    {
        value: 'chat_id',
        label: 'Chat',
        show: true
    },
]

const trades = [
    {
        id: "someid",
        trade_type: 'buy',
        seller: 'dalmasonto.testnet',
        buyer: 'alexmatu.testnet',
        amount: '200',
        token_id: 'near',
        chat_id: 'chat_id',
        start_timestamp: 3232423432,
        end_timestamp: 4242424334,
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


const Trades = () => {

    const [headers, setHeaders] = useState(tableHeaders)

    const navigate = useNavigate()

    const goTo = (url) => {
        navigate(url)
    }

    const getHeader = (value) => {
        return headers.find(header => header.value === value)
    }

    const rows = trades.map((trade, index) => (
        <tr key={`${trade?.id}`}>
            {
                getHeader("trade_type")?.show && (
                    <td>
                        <Text style={{ textTransform: "capitalize" }}>{trade.trade_type}</Text>
                    </td>
                )
            }
            {
                getHeader("buyer")?.show && (
                    <td>
                        <NavLink px={0} label={getTextCount(trade.buyer, 20)} to={`/near/accounts/${trade.buyer}`} component={Link} />
                    </td>
                )
            }
            {
                getHeader("seller")?.show && (
                    <td>
                        <NavLink px={0} label={getTextCount(trade.seller, 20)} to={`/near/accounts/${trade.seller}`} component={Link} />
                    </td>
                )
            }
            {
                getHeader("amount")?.show && (
                    <td>
                        <Text style={{ textTransform: "capitalize" }}>{trade.amount}</Text>
                    </td>
                )
            }
            {
                getHeader("token_id")?.show && (
                    <td>
                        <Text>{trade.token_id}</Text>
                    </td>
                )
            }
            {
                getHeader("start_timestamp")?.show && (
                    <td>
                        <Text style={{ textTransform: "capitalize" }}>{trade.start_timestamp}</Text>
                    </td>
                )
            }
            {
                getHeader("end_timestamp")?.show && (
                    <td>
                        <Text style={{ textTransform: "capitalize" }}>{trade.end_timestamp}</Text>
                    </td>
                )
            }
            {
                getHeader("chat_id")?.show && (
                    <td>
                        <Button radius="xl" color="green" style={{
                            width: "120px"
                        }} onClick={e => goTo(`/near/chats/${trade.chat_id}/`)}>View</Button>
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
                <Title>Trades</Title>
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

export default Trades