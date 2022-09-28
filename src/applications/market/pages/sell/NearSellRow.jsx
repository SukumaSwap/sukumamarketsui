import { Avatar, Button, Group, NavLink, Stack, Text } from '@mantine/core'
import { IconArrowDown, IconArrowUp } from '@tabler/icons'
import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { NEAR_OBJECT } from '../../../../app/appconfig'
import { getTextCount } from '../../../../app/appFunctions'
import { getReadableTokenBalance } from '../../../../app/nearutils'

const NearSellRow = ({offer}) => {
    const navigate = useNavigate()
    const goTo = (url) => {
        navigate(url)
    }
    return (
        <tr>
            <td className='custom-td'>
                <NavLink label={getTextCount(offer.offerer, 20)} to={`/market/accounts/${offer.offerer}`} component={Link} />
            </td>
            <td className='custom-td'>
                <Group>
                    <Avatar src={NEAR_OBJECT.icon} />
                    <Text>
                        {
                            getReadableTokenBalance(offer?.min_amount, 24)
                        }
                        &nbsp;-&nbsp;
                        {
                            getReadableTokenBalance(offer?.max_amount, 24)
                        }
                    </Text>
                </Group>
            </td>
            <td className='custom-td'>
                <Group>
                    <img src={offer?.payment?.icon} alt={offer?.payment?.name} style={{ height: "30px" }} />
                    <Text >{offer?.payment?.name}</Text>
                </Group>
            </td>
            <td className='custom-td'>{offer.currency}</td>
            <td className='custom-td'>
                <Stack>
                    <Group>
                        {offer?.offer_rate > 0 ? (
                            <>
                                <IconArrowUp color="green" />
                                <Text color="green">{offer.offer_rate} %</Text>
                            </>
                        ) : (
                            <>
                                <IconArrowDown color="red" />
                                {offer?.offer_rate} %
                            </>
                        )
                        }
                        <Text>4.323</Text>
                    </Group>
                    <Button radius="xl" color="red" style={{
                        width: "120px"
                    }} onClick={e => goTo("/market/sell/create-sell-trade/offer_id/")}>Sell</Button>
                </Stack>
            </td>
        </tr>
    )
}

export default NearSellRow