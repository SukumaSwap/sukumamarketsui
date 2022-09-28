import React, { forwardRef, useEffect, useState } from 'react'
import { Avatar, Button, Center, Grid, Group, Paper, Popover, ScrollArea, Table, TextInput, Text, Select, Stack, NavLink } from '@mantine/core'
import { getTextCount } from '../../../../app/appFunctions';
import { IconArrowDown, IconArrowUp, IconChevronDown } from '@tabler/icons';
import { Link, useNavigate } from 'react-router-dom';
import { CONTRACT, NEAR_OBJECT } from '../../../../app/appconfig';
import { getReadableTokenBalance } from '../../../../app/nearutils';
import { Near } from 'near-api-js';
import NearSellRow from './NearSellRow';


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

const Sell = () => {
    const [offers, setOffers] = useState([])
    const [loading, setLoading] = useState(false)

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

    const rows = offers.map((offer, index) => (
        <NearSellRow key={`${offer.id}`} offer={offer}/>
    ))

    useEffect(() => {
        loadNearOffers()
    }, [])

    return (
        <Paper pt="md" radius="lg" sx={theme => ({
            background: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[2]
        })}>

            <Grid mb="xl" mt="md">
                <Grid.Col xs={4} md={4}>
                    <Center>
                        <Popover width={400} position="bottom" shadow="md" radius="lg">
                            <Popover.Target>
                                <Button rightIcon={<IconChevronDown />}>Select Asset</Button>
                            </Popover.Target>
                            <Popover.Dropdown>
                                <TextInput placeholder='Search assets' radius="xl" />
                                <Group align="center" position='center' py="xs">
                                    <Asset />
                                    <Asset />
                                    <Asset />
                                    <Asset />
                                </Group>
                            </Popover.Dropdown>
                        </Popover>
                    </Center>
                </Grid.Col>
                <Grid.Col xs={4} md={4}>
                    <Center>
                        <Select
                            // label="Choose Payment Method"
                            placeholder="Payment Method"
                            itemComponent={PaymentSelect}
                            data={paymentMethods}
                            searchable
                            maxDropdownHeight={400}
                            nothingFound="Method Not Found"
                            filter={(value, item) =>
                                item.label.toLowerCase().includes(value.toLowerCase().trim()) ||
                                item.value.toLowerCase().includes(value.toLowerCase().trim())
                            }
                        />
                    </Center>
                </Grid.Col>
                <Grid.Col xs={4} md={4}>
                    <Center>
                        <Select
                            // label="Choose Currency"
                            placeholder="Currency"
                            itemComponent={PaymentSelect}
                            data={currencies}
                            searchable
                            maxDropdownHeight={400}
                            nothingFound="Currency Not Found"
                            filter={(value, item) =>
                                item.label.toLowerCase().includes(value.toLowerCase().trim()) ||
                                item.value.toLowerCase().includes(value.toLowerCase().trim())
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
                                <th className='custom-td'>Sell To</th>
                                <th className='custom-td'>Limits</th>
                                <th className='custom-td'>Payment</th>
                                <th className='custom-td'>Currency</th>
                                <th className='custom-td'>Rate</th>
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

export default Sell