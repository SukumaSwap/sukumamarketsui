import React from 'react'
import { Paper } from '@mantine/core';
import { getTheme } from '../../app/appFunctions';

const ChatBody = ({ children }) => {
    return (
        <Paper sx={theme => ({
            background: getTheme(theme) ? theme.colors.dark[8] : theme.colors.gray[1],
            height: '100%',
            overflow: 'hidden',
            borderRadius: "20px 20px 30px 30px",
            ".chat-head": {
                height: "60px",
                overflow: "hidden",
                display: "flex",
                alignItems: "center",
                background: getTheme(theme) ? theme.colors.dark[6] : theme.colors.gray[2],
                // borderBottom: getTheme(theme) ? theme.colors.dark[6] : theme.colors.gray[1],
            },
            ".chat-body": {
                height: "calc(100% - 120px)",
                background: getTheme(theme) ? theme.colors.dark[8] : "transparent",
            },
            ".chat-footer": {
                height: "60px",
                display: "flex",
                alignItems: "center",
                // background: getTheme(theme) ? theme.colors.dark[6] : theme.colors.gray[2],
            }
        })}>
            {children}
        </Paper>
    )
}

export default ChatBody