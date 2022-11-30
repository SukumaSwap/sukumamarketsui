import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { NEAR_OBJECT } from '../../../../app/appconfig'
import { convertNstoTime, getTextCount } from '../../../../app/appFunctions'
import { getReadableTokenBalance } from '../../../../app/nearutils'
import { Text, NavLink, Avatar, Button, Group } from '@mantine/core';
import parse from "html-react-parser"
import { IconCheck, IconMessageDots, IconX } from '@tabler/icons'

const NearChatRow = ({obj, getHeader}) => {
    const navigate = useNavigate()

    const goTo = (url) => {
        navigate(url)
    }
    return (
        <tr>
            {
                getHeader("offer_id")?.show && (
                    <td>
                        <NavLink px={0} label={getTextCount("View", 20)} to={`/near/buy/create-buy-trade/${obj.offer_id}/`} component={Link} />
                    </td>
                )
            }
            {
                getHeader("message")?.show && (
                    <td>
                        <Text>
                            {parse(obj?.payment_msg)}
                        </Text>
                    </td>
                )
            }
            {
                getHeader("chat")?.show && (
                    <td>
                        <Button radius="xl" color="green" rightIcon={<IconMessageDots size={16} />} style={{
                            width: "130px"
                        }} onClick={e => goTo(`/near/chats/${obj.id}/`)}>Go to Trade</Button>
                    </td>
                )
            }
            {
                getHeader("token")?.show && (
                    <td>
                        <Group>
                            <Avatar src={NEAR_OBJECT?.icon} />
                            <Text>Near</Text>
                        </Group>
                    </td>
                )
            }
            {
                getHeader("owner")?.show && (
                    <td>
                        <NavLink px={0} label={getTextCount(obj.owner, 20)} to={`/market/accounts/${obj.owner}`} component={Link} />
                    </td>
                )
            }
            {
                getHeader("offerer")?.show && (
                    <td>
                        <NavLink px={0} label={getTextCount(obj.offerer, 20)} to={`/market/accounts/${obj.offerer}`} component={Link} />
                    </td>
                )
            }
            {
                getHeader("amount")?.show && (
                    <td>
                        <Text>
                            {
                                getReadableTokenBalance(obj.amount, 24)
                            }
                            &nbsp;
                            Near
                        </Text>
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
                getHeader("payer")?.show && (
                    <td>
                        <NavLink px={0} label={getTextCount(obj.payer, 20)} to={`/market/accounts/${obj.payer}`} component={Link} />
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
                getHeader("paid")?.show && (
                    <td>
                        <Text>{obj.paid ? <IconCheck color='green' /> : <IconX color="red" />}</Text>
                    </td>
                )
            }
            {
                getHeader("received")?.show && (
                    <td>
                        <Text>{obj.received ? <IconCheck color='green' /> : <IconX color="red" />}</Text>
                    </td>
                )
            }
            {
                getHeader("canceled")?.show && (
                    <td>
                        <Text>{obj.canceled ? <IconCheck color='green' /> : <IconX color="red" />}</Text>
                    </td>
                )
            }
            {
                getHeader("released")?.show && (
                    <td>
                        <Text>{obj.released ? <IconCheck color='green' /> : <IconX color="red" />}</Text>
                    </td>
                )
            }
            {
                getHeader("payer_has_rated")?.show && (
                    <td>
                        <Text>{obj.payer_has_rated ? <IconCheck color='green' /> : <IconX color="red" />}</Text>
                    </td>
                )
            }
            {
                getHeader("receiver_has_rated")?.show && (
                    <td>
                        <Text>{obj.receiver_has_rated ? <IconCheck color='green' /> : <IconX color="red" />}</Text>
                    </td>
                )
            }
            {
                getHeader("started_at")?.show && (
                    <td>
                        <Text>
                            {convertNstoTime(obj?.started_at)}
                        </Text>
                    </td>
                )
            }
            {
                getHeader("ended_at")?.show && (
                    <td>
                        <Text>
                            {convertNstoTime(obj?.ended_at)}
                        </Text>
                    </td>
                )
            }
        </tr>
    )
}

export default NearChatRow