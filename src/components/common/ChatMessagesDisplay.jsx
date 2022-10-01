import { Avatar, Box, Group, Paper, Text } from '@mantine/core';
import parse from 'html-react-parser'

const getAmPm = (hrs) => {
    if (parseInt(hrs) < 12) {
        return "AM"
    }
    else {
        return "PM"
    }
}

export const convertToTime = (timestamp) => {
    if (timestamp?.seconds) {
        const date = new Date(timestamp.toDate())
        const day = date.getDate()
        const month = date.getMonth()
        const year = date.getFullYear()
        const hrs = date.getHours()
        const mins = date.getMinutes()
        const fulltime = `${day}/${month}/${year} ${hrs}:${mins} ${getAmPm(hrs)}`
        return fulltime
    }
}

export const LeftMessage = ({ obj }) => {
    convertToTime(obj.timestamp)
    return (
        <>
            <Group mt="md" align="start">
                <Avatar radius="xl" />
                <Box sx={theme => ({
                    background: theme.colors.violet[6],
                    borderRadius: "0 10px 10px 20px",
                    width: "60%",
                    color: "white",
                    padding: "2px 8px",
                })}>
                    <Text size="md">{obj?.msg}</Text>
                    <Text size="xs" align='end'>{convertToTime(obj.timestamp)}</Text>
                </Box>
            </Group>
        </>
    )
}

export const RightMessage = ({ obj }) => {
    convertToTime(obj.timestamp)
    return (
        <>
            <Group mt="md" align="start" position='right'>
                <Box sx={theme => ({
                    background: theme.colors.indigo[6],
                    borderRadius: "10px 0 20px 10px",
                    width: "60%",
                    color: "white",
                    padding: "2px 8px",
                })}>
                    <Text size="md"> {obj?.msg} </Text>
                    <Text size="xs" align='end'>{convertToTime(obj.timestamp)}</Text>
                </Box>
                <Avatar radius="xl" />
            </Group>
        </>
    )
}

export const NotificationMsg = ({ obj }) => {
    return (
        <Paper px="md" py="sm" my="md" radius="md" sx={theme => ({
            background: 'rgba(0, 128, 0, 0.150)'
            // background: 'rgb(4, 61, 4)',
        })}>
            <Text size="md" color="white">{obj?.msg && parse(obj?.msg || "")}</Text>
            <Text size="xs" align='end' color="white">{convertToTime(obj?.timestamp)}</Text>
        </Paper>
    )
}