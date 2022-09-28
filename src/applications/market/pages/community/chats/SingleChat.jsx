import { Group, Stack, Text, ScrollArea, Paper, ActionIcon } from '@mantine/core';
import React from 'react'
import ChatBody from '../../../../../components/common/ChatBody';
import { IconCamera, IconLink, IconMoodSmile, IconUser, IconSend } from '@tabler/icons';
import { getTheme } from '../../../../../app/appFunctions';
import { RightMessage, LeftMessage } from '../../../../../components/common/ChatMessagesDisplay';

const SingleChat = () => {
    return (
        <div className='h-100'>
            <ChatBody>
                <div className="chat-head">
                    <Group px="md">
                        <IconUser size={42} />
                        <Stack spacing="0">
                            <Text>Rashid Abdalla</Text>
                            <Text size="sm" color="green">online</Text>
                        </Stack>
                    </Group>
                </div>
                <div className="chat-body">
                    <ScrollArea className='h-100'>
                        <Paper px="sm" py="sm" style={{
                            background: "transparent"
                        }}>
                            {/* Messages go here */}
                            <LeftMessage obj={{ msg: "Hi there?" }} />
                            <RightMessage obj={{ msg: "Hi" }} />
                            <RightMessage obj={{ msg: "Kindly drop your details" }} />
                            <LeftMessage obj={{ msg: "sending..." }} />
                        </Paper>
                    </ScrollArea>
                </div>
                <div className="chat-footer">
                    <Paper p="xs" sx={theme => ({
                        // background: theme.colors.gray[4],
                        background: getTheme(theme) ? theme.colors.gray[4] : theme.colors.gray[2],
                        width: "100%",
                        borderRadius: theme.radius.xl,
                        height: "100%",
                        display: "flex",
                        alignItems: "center"
                    })}>
                        <Group style={{ width: "100%" }}>
                            <ActionIcon radius="xl" size={32}>
                                <IconLink color='black' />
                            </ActionIcon>
                            <input type="text" className='custom-input' placeholder='Type your message here ...' />
                            <ActionIcon radius="xl" size={32}>
                                <IconMoodSmile color='black' />
                            </ActionIcon>
                            <ActionIcon radius="xl" size={32}>
                                <IconCamera color='black' />
                            </ActionIcon>
                            <ActionIcon radius="xl" size={32}>
                                <IconSend color='black' />
                            </ActionIcon>
                        </Group>
                    </Paper>
                </div>
            </ChatBody>
        </div>
    )
}

export default SingleChat