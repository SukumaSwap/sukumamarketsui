import { useState } from 'react';

import { getTheme } from "../../../app/appFunctions"

import { Modal, Box, Group, Title, ActionIcon, Divider, TextInput, Paper, Avatar, Stack, Text, ScrollArea } from "@mantine/core"


import { IconX } from "@tabler/icons"
import { Carousel } from "@mantine/carousel"
import { NEAR_OBJECT, NETWORKS } from "../../../app/appconfig"

const SelectTokenModal = ({ tokens, select, open, closeModal, selectedToken }) => {
    const [searchedToken, setSearchedToken] = useState("")
    const filterTokens = () => {
        const filteredTokens = tokens?.filter(token => {
            const regex = new RegExp(searchedToken, 'gi');
            return token.symbol.match(regex) || token.name.match(regex) || token.address.match(regex)
        })
        return filteredTokens
    }

    const selectSingle = (token) => {
        select(token);
        closeModal && closeModal();
    }

    return (
        <Modal overflow='inside' lockScroll
            opened={open}
            // title={<Title order={2}>Select Token</Title>} 
            withCloseButton={false}
            onClose={() => closeModal && closeModal(false)}
            padding={0}
            radius="xl" sx={theme => (
                {
                    ".mantine-Modal-modal": {
                        height: "100vh !important",
                        overflow: "hidden !important",
                    },
                    ".mantine-Modal-inner": {
                        paddingTop: "0",
                        paddingBottom: "0",
                    },
                    ".mantine-Modal-body": {
                        // background: "yellow", 
                        height: "calc(100% - 8px) !important",
                        maxHeight: "calc(100% - 8px) !important",
                        overflow: "hidden"
                    },
                    ".custom-h": {
                        height: "60px",
                    },
                    ".custom-body": {
                        height: "calc(100%)",
                        overflow: "hidden !important",
                        // background: "redimport { Carousel } from '@mantine/carousel';
                    }
                })}>
            <Box className='custom-h' p="md">
                <Group position='apart'>
                    <Title order={2}>Select Token</Title>
                    <ActionIcon  onClick={() => closeModal && closeModal(false)}>
                        <IconX />
                    </ActionIcon>
                </Group>
            </Box>
            <Divider />
            <Box className='custom-body' py="xs">
                <Box px="md" style={{ height: "150px", background: "rd" }}>
                    <TextInput value={searchedToken} onChange={e => setSearchedToken(e.target.value)}
                        size='md' radius="lg"
                        placeholder="Search name, symbol or paste address"
                        className='w-100' mb="md"
                        sx={theme => ({
                            ".mantine-TextInput-input": {
                                // borderStyle: "dashed",
                                borderWidth: "2px !important",
                            }
                        })} />
                    <Title order={5} mb="xs">Common tokens</Title>
                    <Carousel slideGap={10} align="start">

                        <Carousel.Slide size={100}>
                            <SelectAssetBtn asset={NEAR_OBJECT} select={selectSingle} selectedToken={selectedToken} />
                        </Carousel.Slide>
                        {
                            tokens?.slice(0, 3).map((item, i) => (
                                <Carousel.Slide key={`token_s_${i}`} size={100}>
                                    <SelectAssetBtn asset={item} select={selectSingle} selectedToken={selectedToken} />
                                </Carousel.Slide>
                            ))
                        }
                    </Carousel>
                </Box>
                <ScrollArea style={{ height: "calc(100% - 150px)", background: "yellw" }}>
                    <Paper py="xs">
                        {
                            filterTokens()?.map((item, i) => (
                                <SelectAsset key={`dfd_${i}`} asset={item} select={selectSingle} selectedToken={selectedToken} />
                            ))
                        }
                    </Paper>
                </ScrollArea>
            </Box>
        </Modal>
    )
}


const SelectAsset = ({ asset, select, selectedToken }) => {
    return (
        <Paper mb="xs" px="md" sx={theme => ({
            background:  selectedToken?.address === asset?.address ? getTheme(theme) ? theme.colors.dark[6] : theme.colors.gray[1] : "transparent",
            cursor: "pointer",
            pointerEvents: selectedToken?.address === asset?.address ? "none" : "all",
            ":hover": {
                background: getTheme(theme) ? theme.colors.dark[4] : theme.colors.gray[1]
            }
        })} onClick={e => select(asset)}>
            <Group>
                <Avatar size="sm" src={asset?.icon} />
                <Stack spacing={-10}>
                    {/* <Title order={6} size="xs">{NEAR_OBJECT.symbol}</Title> */}
                    <Text size="md"><b>${asset?.symbol}</b></Text>
                    <Text size="sm">{asset?.name}</Text>
                </Stack>
            </Group>
        </Paper>
    )
}

const SelectAssetBtn = ({ asset, select, selectedToken }) => {
    return (
        <Paper sx={theme => ({
            background:  selectedToken?.address === asset?.address ? getTheme(theme) ? theme.colors.dark[6] : theme.colors.gray[1] : "transparent",
            borderStyle: "solid",
            borderWidth: "1px",
            borderRadius: "10px",
            borderColor: getTheme(theme) ? theme.colors.dark[4] : theme.colors.gray[4],
            pointerEvents: selectedToken?.address === asset?.address ? "none" : "all",
            padding: "4px 6px",
            cursor: "pointer"
        })} onClick={e => select(asset)}>
            <Group>
                <Avatar size="sm" src={asset?.icon} />
                <Text size="sm">{asset?.symbol}</Text>
            </Group>
        </Paper>
    )
}

export default SelectTokenModal