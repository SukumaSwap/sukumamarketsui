import { useState } from 'react';

import { getCurrencies, getTextCount, getTheme } from "../../../app/appFunctions"

import { Modal, Box, Group, Title, ActionIcon, Divider, TextInput, Paper, Avatar, Stack, Text, ScrollArea } from "@mantine/core"


import { IconX } from "@tabler/icons"
import { Carousel } from "@mantine/carousel"
import { CURRENCIES, NEAR_OBJECT, NETWORKS } from "../../../app/appconfig"
import { useDebouncedValue, useMediaQuery } from '@mantine/hooks';

import FlipMove from 'react-flip-move';


const SelectCurrencyModal = ({ select, open, closeModal, selected }) => {

    const objs = CURRENCIES;

    const [searchedTerm, setSearchedTerm] = useState("")
    const [debounced] = useDebouncedValue(searchedTerm, 500);

    const filteredObjs = () => {
        const filtered = objs?.filter(obj => {
            const regex = new RegExp(debounced, 'gi');
            return obj.symbol.match(regex) || obj.name.match(regex)
        })
        return filtered
    }

    const selectSingle = (obj) => {
        select(obj);
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
                        height: "calc(100% - 60px)",
                        overflow: "hidden !important",
                        // background: "redimport { Carousel } from '@mantine/carousel';
                    }
                })}>
            <Box className='custom-h' p="md">
                <Group position='apart'>
                    <Title order={2}>Select Currency</Title>
                    <ActionIcon onClick={() => closeModal && closeModal(false)}>
                        <IconX />
                    </ActionIcon>
                </Group>
            </Box>
            <Divider />
            <Box className='custom-body' py="xs">
                <Box px="md" style={{ height: "150px", background: "rd" }}>
                    <TextInput value={searchedTerm} onChange={e => setSearchedTerm(e.target.value)}
                        size='md' radius="lg"
                        placeholder="Search name or symbol"
                        className='w-100' mb="md"
                        sx={theme => ({
                            ".mantine-TextInput-input": {
                                // borderStyle: "dashed",
                                borderWidth: "2px !important",
                                borderColor: theme.colors.pink[6],
                            }
                        })} />
                    <Title order={5} mb="xs">Common currencies</Title>
                    <Carousel slideGap={10} align="start" slideSize="40%">
                        {
                            getCurrencies(["KES", "USD", "EUR"]).map((item, i) => (
                                <Carousel.Slide key={`token_s_${i}`} style={{ overflow: "hidden" }}>
                                    <SelectAssetBtn asset={item} select={selectSingle} selected={selected} />
                                </Carousel.Slide>
                            ))
                        }
                    </Carousel>
                </Box>
                <ScrollArea style={{ height: "calc(100% - 150px)", background: "yellw" }}>
                    <Paper py="xs">
                        <FlipMove>
                            {
                                filteredObjs()?.map((item, i) => (
                                    <div key={`dfd_${item.symbol}_${i}`}>
                                        <SelectAsset asset={item} select={selectSingle} selected={selected} />
                                    </div>
                                ))
                            }
                        </FlipMove>
                    </Paper>
                </ScrollArea>
            </Box>
        </Modal>
    )
}


const SelectAsset = ({ asset, select, selected }) => {
    return (
        <Paper mb="xs" px="md" sx={theme => ({
            background: selected?.symbol === asset?.symbol ? getTheme(theme) ? theme.colors.dark[6] : theme.colors.gray[1] : "transparent",
            cursor: "pointer",
            pointerEvents: selected?.symbol === asset?.symbol ? "none" : "all",
            ":hover": {
                background: getTheme(theme) ? theme.colors.dark[4] : theme.colors.gray[1]
            }
        })} onClick={e => select(asset)}>
            <Group>
                <Avatar size="md" radius="xl" sx={theme => ({
                    background: theme.fn.linearGradient(45, 'red', 'blue'),
                    ".mantine-Avatar-placeholder": {
                        background: "transparent"
                    }
                })}>{asset?.symbol}</Avatar>
                <Stack spacing={-10}>
                    <Text size="md"><b>${asset?.symbol}</b></Text>
                    <Text size="sm">{asset?.name}</Text>
                </Stack>
            </Group>
        </Paper >
    )
}

const SelectAssetBtn = ({ asset, select, selected }) => {
    const matches = useMediaQuery('(max-width: 768px)');
    return (
        <Paper sx={theme => ({
            background: selected?.symbol === asset?.symbol ? getTheme(theme) ? theme.colors.dark[6] : theme.colors.gray[1] : "transparent",
            borderStyle: "solid",
            borderWidth: "1px",
            borderRadius: "10px",
            borderColor: getTheme(theme) ? theme.colors.dark[4] : theme.colors.gray[4],
            pointerEvents: selected?.symbol === asset?.symbol ? "none" : "all",
            padding: "4px 6px",
            cursor: "pointer"
        })} onClick={e => select(asset)}>
            <Group>
                <Avatar size="sm" sx={theme => ({
                    background: theme.fn.linearGradient(45, 'red', 'blue'),
                    ".mantine-Avatar-placeholder": {
                        background: "transparent"
                    }
                })}>{asset?.symbol}</Avatar>
                <Text size="sm">{getTextCount(asset?.name, matches ? 8 : 12)}</Text>
            </Group>
        </Paper>
    )
}

export default SelectCurrencyModal