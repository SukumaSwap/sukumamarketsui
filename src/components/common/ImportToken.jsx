import { useState } from "react"
import { Modal, useMantineTheme, Button as MTButton, Text, Loader, TextInput, Group, Alert, Center, Avatar, Stack, Title, Grid } from "@mantine/core"
import { showNotification } from "@mantine/notifications"
import { IconAlertCircle, IconSearch } from "@tabler/icons"
const ImportTokenModal = ({ open, onclose, callbackfn }) => {
    const [tokenFound, setTokenFound] = useState(null)
    const [searchedToken, setSearchedToken] = useState("")
    const [error, setError] = useState(null)
    const [searching, setSearching] = useState(false)
    const [adding, setAdding] = useState(false)
    const theme = useMantineTheme()


    const getTokenMetadata = () => {
        const wallet = window.walletConnection
        if (wallet) {
            setSearching(true)
            setError(null)
            wallet.account().viewFunction(searchedToken, "ft_metadata", {}, "3000000000000000").then(res => {
                setTokenFound(res)
            }).catch(err => {
                setError("Something went wrong, check the token address and try again")
            }).finally(() => {
                setSearching(false)
            })
        }
    }


    const importToken = () => {
        const wallet = window.walletConnection
        const contract = window.contract
        if (wallet && contract) {
            setAdding(true)
            contract.add_token({
                token: searchedToken, metadata: {
                    address: searchedToken,
                    name: tokenFound.name || "",
                    symbol: tokenFound.symbol || "",
                    icon: tokenFound.icon || "",
                    decimals: tokenFound.decimals,
                }
            }).then(res => {
                console.log("token added", res)
                callbackfn()
                showNotification({
                    message: "Token added successfully",
                    color: "green"
                })
                onclose()
            }).catch(err => {
                console.log("add token error", err)
                showNotification({
                    message: "Could not import token",
                    color: "red"
                })
            }).finally(() => {
                setAdding(false)
            })
        }
    }

    return (
        <>
            <Modal
                opened={open}
                onClose={onclose}
                title="Import Token"
                overlayBlur={3}
                overlayOpacity={0.1}
                overlayColor={theme.colors.dark[2]}
                radius={"lg"}
            >
                <Grid my="md">
                    <Grid.Col xs={8}>
                        <TextInput value={searchedToken} onChange={e => setSearchedToken(e.target.value)} placeholder='Search Token' />
                    </Grid.Col>
                    <Grid.Col xs={4}>
                        <MTButton onClick={getTokenMetadata} color="primary" leftIcon={<IconSearch />}>
                            SEARCH
                        </MTButton>
                    </Grid.Col>
                </Grid>
                <div className="py-3">
                    {searching && (
                        <div className="d-flex justify-content-center py-2">
                            <Loader variant='bars' />
                        </div>
                    )}
                    {
                        !searching && tokenFound && !error && (
                            <>
                                <Title order={4} align="start" my="md">{searchedToken}</Title>
                                <Group className="row">
                                    <Avatar src={tokenFound?.icon} size="lg" />
                                    <Stack spacing={0}>
                                        <Text>{tokenFound?.name}</Text>
                                        <Text size="sm">{tokenFound?.symbol}</Text>
                                        <Text size="sm">Decimals: {tokenFound?.decimals}</Text>
                                    </Stack>
                                </Group>
                                <Center my="md">
                                    <MTButton color={"green"} radius="xl" onClick={importToken} rightIcon={adding && <Loader size={18} />}>Import Token</MTButton>
                                </Center>
                            </>
                        )
                    }

                    {
                        error && (
                            <Alert icon={<IconAlertCircle size={16} />} title="Bummer!" color="red">
                                Something is wrong with the address you entered.
                            </Alert>
                        )
                    }
                </div>
                <div className="mt-4">
                    <Group position='right'>
                        <MTButton color={"red"} onClick={onclose}>Cancel</MTButton>
                    </Group>
                </div>
            </Modal>
        </>
    );
}

export default ImportTokenModal