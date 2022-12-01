import { Menu, Button, Text, Group, Paper, Avatar, Stack } from '@mantine/core';
import { NETWORKS } from '../../app/appconfig';
import { getTextCount } from '../../app/appFunctions';
import { selectNetwork, setNetwork } from '../../features/app/appSlice';
import { useSelector, useDispatch } from 'react-redux';


const CustomText = ({ active, text, ...rest }) => {
    return (
        <Text {...rest} sx={theme => ({
            color: theme.colorScheme === 'dark' ? active ? theme.colors.gray[0] : theme.colors.gray[6] : active ? theme.colors.dark[6] : theme.colors.dark[1],
        })}>
            {text}
        </Text>
    )
}

export const DrawerNetwork = ({ close, network }) => {
    const dispatch = useDispatch()
    const network_ = useSelector(selectNetwork)
    const setNetwork_ = () => {
        dispatch(setNetwork(network))
        close && close()
    }
    return (
        <Paper fullWidth disabled={!network.active} p="xs" mb="xs" sx={theme => ({
            background: theme.colorScheme === 'dark' ? !network.active ? theme.colors.dark[5] : theme.colors.dark[4] : !network.active ? theme.colors.gray[1] : theme.colors.gray[2],
            borderRadius: theme.radius.md,
            height: 64,
            cursor: network.active ? "pointer" : "not-allowed",
            borderWidth: "2px",
            borderStyle: "solid",
            borderColor: network_?.network_id === network.network_id ? theme.colors.green[6] : "transparent"
        })} onClick={setNetwork_}>
            <Group position='apart'>
                <Avatar size="md" src={network.icon} />
                <Stack align="end" spacing={0}>
                    <CustomText active={network?.active} text={network?.name}/>
                    {!network.active && <CustomText active={network?.active} size="sm" align='end' text={"Coming soon"} />}
                </Stack>
            </Group>
        </Paper>
    )
}

export const MenuNetwork = ({ network }) => {
    const network_ = useSelector(selectNetwork)
    const dispatch = useDispatch()
    const setNetwork_ = () => {
        dispatch(setNetwork(network))
    }
    return (
        <Menu.Item disabled={!network.active} px="xl" py="xs" mb="xs" sx={theme => ({
            background: theme.colorScheme === 'dark' ? !network.active ? theme.colors.dark[5] : theme.colors.dark[4] : !network.active ? theme.colors.gray[1] : theme.colors.gray[2],
            borderRadius: theme.radius.md,
            // height: 64
            borderWidth: "2px",
            borderStyle: "solid",
            borderColor: network_?.network_id === network.network_id ? theme.colors.green[6] : "transparent"
        })} onClick={setNetwork_}>
            <Group position='apart'>
                <Avatar size="md" src={network.icon} />
                <Stack align="end" spacing={0}>
                    <Text>{network?.name}</Text>
                    {!network.active && <Text size="sm" align='end'>Coming soon</Text>}
                </Stack>
            </Group>
        </Menu.Item>
    )
}

function NetworkSwitcher() {
    const network = useSelector(selectNetwork)
    return ( 
        <Menu shadow="md" width={270} radius="lg">
            <Menu.Target>
                <Button radius="xl" style={{
                    height: "42px",
                    padding: "0 30px",
                }} color="violet">
                    <Group>
                        <Text style={{
                            textTransform: "uppercase"
                        }}>{getTextCount(network?.name, 4)}</Text>
                        <Avatar size="sm" src={network?.icon} />
                    </Group>
                </Button>
            </Menu.Target>

            <Menu.Dropdown px="md" py="xl">
                {
                    NETWORKS?.map((network, index) => (
                        <MenuNetwork key={`${network.network_id}_${index}`} network={network} />
                    ))
                }
            </Menu.Dropdown>
        </Menu>
    );
}

export default NetworkSwitcher;