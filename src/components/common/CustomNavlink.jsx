
import { Anchor, Avatar, Badge, Group, Indicator, NavLink, Stack, Text, Title, useMantineTheme } from "@mantine/core";
import { IconDots } from "@tabler/icons";
import { Link, useMatch, useResolvedPath } from "react-router-dom";

const CustomNavLink = ({ navlink, openSidebar }) => {
    const theme = useMantineTheme()
    let resolved = useResolvedPath(navlink.to);
    let match = useMatch({ path: resolved.pathname, end: true });

    const getTheme = () => {
        if (theme.colorScheme === 'dark') {
            return true
        }
        return false
    }
    return (
        <Anchor component={Link} to={navlink.to} style={{ textDecoration: "none" }} onClick={e => {
            if (openSidebar) {
                openSidebar(false);
            }
        }} mb="sm">
            <NavLink label={
                <>
                    <Group position="center" align="center">
                        <Text size="md">{navlink.label}</Text>
                        {match ? navlink.icon : <IconDots size={16} color={theme.colorScheme} />}
                    </Group>
                </>
            }
                // icon={navlink.icon}
                active={match}
                description={navlink.description}
                mb="xs"
                sx={theme => ({
                    borderRadius: match ? theme.radius.md : 0,
                    textAlign: 'center',
                    '&:hover': {
                        borderRadius: theme.radius.md,
                    },
                    backgroundColor: match ? `${theme.colors.gray[0]} !important` : 'transparent',
                    color: match ? `${theme.colors.dark[8]} !important` : getTheme() ? theme.colors.gray[0] : theme.colors.dark[8],
                })}
            />
        </Anchor>
    )
}

const CustomNavLinkEnd = ({ navlink, openSidebar }) => {
    const theme = useMantineTheme()
    let resolved = useResolvedPath(navlink.to);
    let match = useMatch({ path: resolved.pathname, end: false });

    const getTheme = () => {
        if (theme.colorScheme === 'dark') {
            return true
        }
        return false
    }
    return (
        <Anchor component={Link} to={navlink.to} style={{ textDecoration: "none" }} onClick={e => {
            if (openSidebar) {
                openSidebar(false);
            }
        }} >
            <NavLink label={
                <>
                    <Text size="md">{navlink.label}</Text>
                </>
            }
                active={match}
                description={navlink.description}
                sx={theme => ({
                    borderRadius: match ? theme.radius.md : 0,
                    textAlign: 'center',
                    '&:hover': {
                        borderRadius: theme.radius.md,
                    },
                    backgroundColor: match ? `${theme.colors.blue[5]} !important` : 'transparent',
                    color: match ? `${theme.colors.dark[8]} !important` : getTheme() ? theme.colors.gray[0] : theme.colors.dark[8],
                })}
            />
        </Anchor>
    )
}

const SingleChatLink = ({ navlink, openSidebar }) => {
    const theme = useMantineTheme()
    let resolved = useResolvedPath(navlink.to);
    let match = useMatch({ path: resolved.pathname, end: false });

    const getTheme = () => {
        if (theme.colorScheme === 'dark') {
            return true
        }
        return false
    }
    return (
        <Anchor component={Link} to={navlink.to} style={{ textDecoration: "none" }} onClick={e => {
            if (openSidebar) {
                openSidebar(false);
            }
        }} >
            <NavLink label={
                <>
                    <Group>
                        <Indicator dot inline size={18} offset={7} position="top-end" color="green.5" withBorder>
                            <Avatar
                                size="lg"
                                radius="xl"
                                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=250&q=80"
                            />
                        </Indicator>
                        <Stack spacing={10} style={{ flexGrow: 1 }}>
                            <Group position="apart">
                                <Title order={4} size="md">{navlink.label}</Title>
                                <Text size="xs">10:04 a.m</Text>
                            </Group>
                            <Group position="apart">
                                <Text size="sm">{navlink.label}</Text>
                                <IconDots size={18} color={getTheme(theme) ? theme.colors.gray[2] : theme.colors.dark[6]} />
                            </Group>
                        </Stack>
                    </Group>
                </>
            }
                active={match}
                description={navlink.description}
                mb="xs"
                sx={theme => ({
                    borderRadius: match ? theme.radius.md : 0,
                    '&:hover': {
                        borderRadius: theme.radius.md,
                        background: !getTheme(theme) && theme.colors.gray[2]
                    },
                    background: match ? `${theme.fn.linearGradient(90, theme.colors.violet[8], theme.colors.blue[5])} !important` : 'transparent',
                    color: match ? `${theme.colors.dark[8]} !important` : getTheme() ? theme.colors.gray[0] : theme.colors.dark[8],
                })}
            />
        </Anchor>
    )
}

const CustomNavLinkOne = ({ navlink, openSidebar }) => {
    let resolved = useResolvedPath(navlink.to);
    let match = useMatch({ path: resolved.pathname, end: true });
    return (
        <Anchor component={Link} to={navlink.to} style={{ textDecoration: "none" }} onClick={e => {
            if (openSidebar) {
                openSidebar(false);
            }
        }} mb="sm">
            <NavLink label={navlink.label} icon={navlink.icon} active={match}
                description={navlink.description}
                mb="xs"
                sx={theme => ({
                    borderRadius: match ? theme.radius.md : 0,
                    '&:hover': {
                        borderRadius: theme.radius.md,
                    }
                })}
            />
        </Anchor>
    )
}


export default CustomNavLink
export { CustomNavLinkOne, CustomNavLinkEnd, SingleChatLink }