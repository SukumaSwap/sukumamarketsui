import { NavLink, Text, useMantineTheme } from '@mantine/core'
import React from 'react'
import { Link, useMatch, useResolvedPath } from 'react-router-dom'

const CustomNavbarLink = ({ obj }) => {
    const theme = useMantineTheme()
    let resolved = useResolvedPath(obj.to);
    let match = useMatch({ path: resolved.pathname, end: true });
    const getTheme = () => {
        if (theme.colorScheme === 'dark') {
            return true
        }
        return false
    }

    return (
        <NavLink component={Link}
            label={<Text size="md">{obj?.label}</Text>}
            to={obj?.to} disabled={obj?.disabled}
            px="xl"
            mr="lg"
            sx={theme => ({
                backgroundColor: match ? `${theme.colors.gray[0]} !important` : 'transparent',
                color: match ? `${theme.colors.dark[8]} !important` : getTheme() ? theme.colors.gray[0] : theme.colors.dark[8],
                borderRadius: theme.radius.sm,
                position: "relative",
                width: '120px',
                textAlign: 'center',
                "& :hover": {
                    ":before": {
                        content: '""',
                        width: "100%",
                        background: getTheme() ? "white": theme.colors.gray[4],
                        height: match ? 0 : "2px",
                        position: "absolute",
                        bottom: 0,
                        right: 0,
                    }
                }
            })} />
    )
}

export default CustomNavbarLink