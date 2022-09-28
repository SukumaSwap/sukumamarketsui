import { Carousel } from '@mantine/carousel'
import { ActionIcon, Avatar, Box, Center, Grid, Group, Paper, Stack, Text, Title } from '@mantine/core'
import { IconArrowBack, IconCoin, IconCoinBitcoin, IconThumbDown, IconThumbUp } from '@tabler/icons'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { getTextCount, getTheme, greenGradientBg } from '../../../../app/appFunctions'
import GoBackButton from '../../../../components/common/GoBackButton'

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
                  {getTextCount("dalmasonto.testnet", 20)}
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
                    <Text color="dark">102</Text>
                  </Group>
                  <Group >
                    <IconThumbDown color='red' />
                    <Text color="dark">102</Text>
                  </Group>
                </Group>
              </Center>
            </Grid.Col>
            <Grid.Col xs={12} sm={4} md={3}>
              <Center style={{
                height: "100%"
              }}>
                <Text color="dark">
                  Trades: 20
                </Text>
              </Center>
            </Grid.Col>
          </Grid>
          <Title order={2} color="dark">Bio</Title>
          <Text color="dark">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. 
            Reiciendis quos quasi dignissimos corporis quibusdam, 
            aliquam voluptate tempora voluptates aut sequi fugiat 
            doloribus minima consectetur facilis et porro labore! Dolore, ipsam?
          </Text>
        </Paper>
      </section>
      <section>
        <Title order={2} my="md">Account Statistics</Title>
        <Grid>
          <AccountStat title="Trades" value="12" />
          <AccountStat title="Transfers" value="54" />
          <AccountStat title="Offers" value="34" />
          <AccountStat title="Active Offers" value="32" />
          <AccountStat title="Partners" value="56" />
          <AccountStat title="Positive Feedback" value="234" />
          <AccountStat title="Negative Feedback" value="43" />
          <AccountStat title="Blocked By" value="4" />
          <AccountStat title="Wallet Age (years)" value="0.1" />
        </Grid>
      </section>
    </div>
  )
}

export default UserAccount