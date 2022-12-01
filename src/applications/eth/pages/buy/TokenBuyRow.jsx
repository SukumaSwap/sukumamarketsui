import { Avatar, Button, Group, NavLink, Stack, Text, Tooltip } from '@mantine/core'
import { IconArrowDown, IconArrowUp } from '@tabler/icons'
import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getTextCount } from '../../../../app/appFunctions'
import { calcOfferRate, getReadableTokenBalance } from '../../../../app/nearutils'

const TokenBuyRow = ({ offer, tokenprice }) => {

    const navigate = useNavigate()
    const goTo = (url) => {
        navigate(url)
    }

    return (
        <tr >
            <td className='custom-td'>
                <NavLink label={getTextCount(offer?.offerer?.id, 20)} to={`/near/accounts/${offer?.offerer?.id}`} component={Link} />
            </td>
            <td className='custom-td'>
                <Group>
                    <Avatar src={offer?.token?.icon} />
                    <Text>
                        {
                            getReadableTokenBalance(offer?.min_amount, offer?.token?.decimals)
                        }
                        &nbsp;-&nbsp;
                        {
                            getReadableTokenBalance(offer?.max_amount, offer?.token?.decimals)
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
                                <IconArrowDown color="red" />
                                {offer.offer_rate}%
                            </>
                        ) : (
                            <>
                                <IconArrowUp color="green" />
                                {offer?.offer_rate * -1}%
                            </>
                        )
                        }
                        <Tooltip label={`Original price $${tokenprice}`} color="violet">
                            <Text>
                                ${calcOfferRate(offer?.offer_rate, tokenprice)}
                            </Text>
                        </Tooltip>
                    </Group>
                    <Button radius="xl" color="green" style={{
                        width: "120px"
                    }} onClick={e => goTo(`/near/buy/create-buy-trade/asset/${offer?.id}/`)}>Buy</Button>
                </Stack>
            </td>
        </tr>
    )
}

export default TokenBuyRow