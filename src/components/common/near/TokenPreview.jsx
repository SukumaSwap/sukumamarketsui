import { Group, Paper, Avatar, Text, Stack, useMantineTheme } from '@mantine/core'
import React from 'react'
import { getTheme } from '../../../app/appFunctions'

const TokenPreview = ({ offerDetails, tokenPrice }) => {
    const theme = useMantineTheme()
    return (
        <Paper p="xs" radius="md" my="sm" sx={{
            background: getTheme(theme) ? theme.colors.dark[8] : theme.colors.gray[2]
        }}>
            <Group position='apart'>
                <Group>
                    <Avatar src={offerDetails?.token?.icon} />
                    <Stack spacing={0}>
                        <Text size="md">{offerDetails?.token?.name}</Text>
                        <Text size="xs">{offerDetails?.token?.address}</Text>
                        <Text size="sm">{offerDetails?.token?.symbol}</Text>
                    </Stack>
                </Group>
                <Text sx={{
                    background: getTheme(theme) ? theme.colors.dark[3] : theme.colors.gray[3],
                    borderRadius: theme.radius.sm,
                    padding: '2px 4px',
                }}>${tokenPrice}</Text>
            </Group>
        </Paper>
    )
}

export default TokenPreview