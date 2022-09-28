import { Center, Paper, Stack, Text, Title } from '@mantine/core'
import { IconArrowsMoveHorizontal, IconLine, IconLineHeight } from '@tabler/icons'
import React from 'react'
import { getTheme } from '../../app/appFunctions'

const NoChatSelected = ({ title, msg }) => {
    return (
        <Paper radius="lg" sx={theme => ({
            background: getTheme(theme) ? theme.colors.dark[6] : theme.colors.gray[1],
            height: '100%',
        })}>
            <Center className='h-100'>
                <Stack align="center">
                    <Title order={2} align='center' mb="lg">{title}</Title>
                    <IconArrowsMoveHorizontal />
                    <Text mt="lg">{msg}</Text>
                </Stack>
            </Center>
        </Paper>
    )
}

export default NoChatSelected