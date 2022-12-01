import React from 'react'
import { Avatar, Center, Grid, Group, Paper, Stack, Text, Title } from '@mantine/core'
import { IconThumbDown, IconThumbUp } from '@tabler/icons'
import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { getTextCount, getTheme, greenGradientBg } from '../../../../app/appFunctions'
import GoBackButton from '../../../../components/common/GoBackButton'
import { useState } from 'react';
import { SukMarketViewFunctionCall } from '../../../../app/nearutils'

const AccountStat = ({ title, value }) => {
  return (
    <Grid.Col xs={6} sm={4} md={3}>
      <Paper py="md" px="xl" radius="md" sx={theme => ({
        background: getTheme(theme) ? theme.colors.dark[6] : theme.colors.gray[2]
      })}>
        <Stack align="center" spacing={4}>
          <Text>{title}</Text>
          <Title order={5} color="green">{value}</Title>
        </Stack>
      </Paper>
    </Grid.Col>
  )
}

const UserAccount = () => {
  const [acc, setAcc] = useState(null)
  const { account_id } = useParams()

  const loadAccount = () => {
    const wallet = window.walletConnection
    if (wallet) {
      SukMarketViewFunctionCall(wallet, {
        methodName: "acc_pub_info",
        args: {
          account_id
        }
    }).then(res => {
        setAcc(res)
      }).catch(err => {})
    }
  }

  useEffect(() => {
    loadAccount()
  }, [])

  return (
    <div>
      <GoBackButton />
      <section>
        <Paper px="md" py="sm" radius="md" sx={theme => ({
          background: greenGradientBg(theme)
        })}>

          <Title order={2} color="dark">Trader Details</Title>
          <Grid my="sm">
            <Grid.Col xs={12} sm={4} md={3}>
              <Center style={{
                height: "100%"
              }}>
                <Stack>
                  <Avatar />
                  <Text size="sm" color="green">Online</Text>
                </Stack>
              </Center>
            </Grid.Col>
            <Grid.Col xs={12} sm={4} md={3}>
              <Center style={{
                height: "100%"
              }}>
                <Text color="dark" weight={700}>
                  {getTextCount(acc?.id || "", 20)}
                </Text>
              </Center>
            </Grid.Col>
            <Grid.Col xs={12} sm={4} md={3}>
              <Center style={{
                height: "100%"
              }}>
                <Group>
                  <Group >
                    <IconThumbUp color='green' />
                    <Text color="dark">{acc?.likes}</Text>
                  </Group>
                  <Group >
                    <IconThumbDown color='red' />
                    <Text color="dark">{acc?.dislikes}</Text>
                  </Group>
                </Group>
              </Center>
            </Grid.Col>
            <Grid.Col xs={12} sm={4} md={3}>
              <Center style={{
                height: "100%"
              }}>
                <Text color="dark">
                  Trades: {acc?.trades}
                </Text>
              </Center>
            </Grid.Col>
          </Grid>
          <Title order={2} color="dark">Bio</Title>
          <Text color="dark">
            [_NOTHING_]
          </Text>
        </Paper>
      </section>
      <section>
        <Title order={2} my="md">Account Statistics</Title>
        <Grid>
          <AccountStat title="Trades" value={acc?.trades} />
          <AccountStat title="Transfers" value={acc?.transfers} />
          <AccountStat title="Offers" value={acc?.offers} />
          <AccountStat title="Active Offers" value={acc?.offers} />
          <AccountStat title="Partners" value="0" />
          <AccountStat title="Positive Feedback" value={acc?.likes} />
          <AccountStat title="Negative Feedback" value={acc?.dislikes} />
          <AccountStat title="Blocked By" value={acc?.blocked_by} />
          <AccountStat title="Wallet Age (years)" value="0.1" />
        </Grid>
      </section>
    </div>
  )
}

export default UserAccount