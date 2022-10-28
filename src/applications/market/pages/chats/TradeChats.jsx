import { Avatar, Button, Group, Paper, Popover, ScrollArea, Table, Text, NavLink, Title, Checkbox, Divider, Switch } from '@mantine/core'
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
        label: 'Trade',
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
        show: false
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
        show: true
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

const tradesSettings = [
    {
        id: "asset_type",
        value: "all",
        label: "All Assets",
        active: true
    },
    {
        id: "asset_type",
        value: "near",
        label: "Near",
        active: true
    },
    {
        id: "asset_type",
        value: "others",
        label: "Other Assets",
        active: true
    },
    {
        id: "trade_status",
        value: "active",
        label: "Active",
        active: true
    },
    {
        id: "trade_status",
        value: "inactive",
        label: "Inactive",
        active: false
    }
]

const SelectTableHeaders = ({ headers, selectHeader, settings, setSetting }) => {
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
                        <Text>Trades settings</Text>
                        {
                            tradesSettings.map((setting, index) => (
                                <Group key={setting.value} position='apart' sx={theme => ({
                                    width: "100% !important",
                                    background: getTheme(theme) ? theme.colors.dark[4] : theme.colors.gray[2],
                                    borderRadius: theme.radius.md,
                                    padding: '6px 16px',
                                    margin: "10px 0",
                                    cursor: "pointer"
                                })} onClick={e => {
                                    if(setting.id === 'asset_type'){
                                        setSetting("asset_type", setting.value)
                                    }
                                    else{
                                        setSetting("trade_status", setting.active)
                                    }
                                }}>
                                    <Text>{setting.label}</Text>
                                    {
                                        setting.id === 'asset_type' && 
                                        <Switch checked={settings["asset_type"] === setting.value} readOnly />
                                    }
                                    {
                                        setting.id === 'trade_status' && 
                                        <Switch checked={settings["trade_status"] === setting.active} readOnly />
                                    }
                                </Group>
                            ))
                        }
                        
                        <Divider my="md" />
                        <Text>Table settings</Text>
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
    const [settings, setSettings] = useState({
        asset_type: "all",
        trade_status: true
    })

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

    const rows = chats?.filter(obj => obj?.active === settings?.trade_status).sort((a, b) => b.started_at - a.started_at).map((obj, index) => (
        <NearChatRow key={`near_chat_row_${index}`} obj={obj} getHeader={getHeader} />
    ))
    const tokenrows = tokenChats?.filter(obj => obj?.active === settings?.trade_status).map((obj, index) => (
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

    const setSetting = (id, value) => {
        const settings_ = {...settings}
        settings_[id] = value
        setSettings(settings_)
    }

    const loadChats = () => {
        setLoading(true)
        const contract = window.contract
        const wallet = window.walletConnection
        if (contract && wallet) {
            wallet.account().viewFunction(CONTRACT, "get_account_chats", { account_id: wallet.getAccountId() }).then(res => {
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
                <SelectTableHeaders headers={headers} selectHeader={selectHeader} settings={settings} setSetting={setSetting} />
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
                            {
                                settings?.asset_type === "all" && <>
                                {rows}
                            {tokenrows}
                                </>
                            }
                            {
                                settings?.asset_type === "near" && rows
                            }
                            {
                                settings?.asset_type === "others" && tokenrows
                            }
                        </tbody>
                    </Table>
                </ScrollArea>
            </Paper>
        </Paper>
    )
}

export default TradeChats