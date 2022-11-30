import {Paper, Title, Grid, Center, Stack, Group, Avatar, Text} from "@mantine/core"
import {IconThumbUp, IconThumbDown} from '@tabler/icons';
import { getTextCount, greenGradientBg } from "../../../app/appFunctions";


export const UserProfileCard = ({ offerDetails }) => {
    return (
        <Paper px="md" py="xs" radius="md" sx={theme => ({
            background: greenGradientBg(theme)
        })}>
            <Title order={2} color="dark">Seller Details</Title>
            <Grid my="sm">
                <Grid.Col xs={12} sm={6}>
                    <Center style={{
                        height: "100%"
                    }}>
                        <Stack>
                            <Avatar />
                            <Text size="sm" color="green">Online</Text>
                        </Stack>
                    </Center>
                </Grid.Col>
                <Grid.Col xs={12} sm={6}>
                    <Center style={{
                        height: "100%"
                    }}>
                        <Stack>
                            <Title order={4} color="dark" weight={700} align='center'>
                                {getTextCount(offerDetails?.offerer?.id || "", 18)}
                            </Title>
                            <Group align="center" position='center'>
                                <Group >
                                    <IconThumbUp color='green' />
                                    <Text color="dark">{offerDetails?.offerer?.likes}</Text>
                                </Group>
                                <Group >
                                    <IconThumbDown color='red' />
                                    <Text color="dark">{offerDetails?.offerer?.dislikes}</Text>
                                </Group>
                            </Group>
                            <Text color="dark" align='center'>
                                Trades: {offerDetails?.offerer?.trades}
                            </Text>
                        </Stack>
                    </Center>
                </Grid.Col>

            </Grid>
        </Paper>
    )
}