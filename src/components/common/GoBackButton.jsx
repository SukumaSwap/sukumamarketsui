import React from 'react'
import { useNavigate } from 'react-router-dom';
import { ActionIcon, Group, Text } from '@mantine/core';
import { IconArrowBack } from '@tabler/icons';
import { getTheme } from '../../app/appFunctions';

const GoBackButton = () => {
    const navigate = useNavigate()
    return (
        <Group p="xs" mb="md" sx={theme => ({
            cursor: "pointer",
            width: "200px",
            borderRadius: theme.radius.md,
            ":hover": {
                background: getTheme(theme) ? theme.colors.dark[5] : theme.colors.gray[2]
            }
        })} onClick={e => navigate(-1)}>
            <ActionIcon size={42} radius="xl" sx={theme => ({
                background: theme.colorScheme === "dark" ? theme.colors.gray[2] : theme.colors.gray[3],
                color: getTheme(theme) ? theme.colors.dark[6] : theme.colors.dark[3],
            })}>
                <IconArrowBack size={32} />
            </ActionIcon>
            <Text>Go Back</Text>
        </Group>
    )
}

export default GoBackButton