import { Avatar, Box, Group, Text } from '@mantine/core';

export const LeftMessage = ({ obj }) => {
    return (
        <Group mt="md" align="start">
            <Avatar radius="xl" />
            <Box sx={theme => ({
                background: theme.colors.violet[6],
                borderRadius: "0 10px 10px 20px",
                width: "60%",
                color: "white",
                padding: "8px",
            })}>
                <Text size="lg">{obj?.msg}</Text>
            </Box>
        </Group>
    )
}

export const RightMessage = ({ obj }) => {
    return (
        <Group mt="md" align="start" position='right'>
            <Box sx={theme => ({
                background: theme.colors.indigo[6],
                borderRadius: "10px 0 20px 10px",
                width: "60%",
                color: "white",
                padding: "8px",
            })}>
                <Text size="lg">
                    {obj?.msg}
                </Text>
            </Box>
            <Avatar radius="xl" />
        </Group>
    )
}