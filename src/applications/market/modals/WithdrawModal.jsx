import React, { useState } from 'react'
import { Button, Group, Modal, Paper, Stepper, Text, TextInput, Title, NumberInput, ScrollArea, Center, Stack } from '@mantine/core';
import { IconArrowForward, IconArrowBack, IconCurrencyDollar, IconArrowBarDown } from '@tabler/icons';
import { getTheme } from '../../../app/appFunctions';
import { useMantineTheme } from '@mantine/core';

const WithdrawModal = () => {
    const [open, setOpen] = useState(false)
    const [step, setStep] = useState(0)
    const [amount, setAmount] = useState(0)

    const theme = useMantineTheme()
    return (
        <>
            <Button radius="xl" style={{
                height: '44px',
                color: getTheme(theme) ? theme.colors.gray[1] : theme.colors.dark[6]
            }} variant="outline" onClick={e => setOpen(true)}>
                <Group>
                    <>Withdraw</>
                    <IconArrowBarDown size={18} />
                </Group>
            </Button>
            <Modal opened={open}
                title="Withdraw"
                radius="lg"
                size="xl"
                transition="fade"
                // style={{ height: "70vh" }}
                onClose={e => setOpen(false)} >
                <Title order={2} mb="sm" align='center'>Withdraw Assets From Your Account</Title>
                <Text align='center' mb="sm">Quickly withdraw assets to your main wallet!</Text>
                <Paper p="xs" radius="lg" sx={theme => ({
                    background: getTheme(theme) ? theme.colors.dark[5] : theme.colors.gray[1],
                    height: "330px"
                })}>
                    <Stepper active={step}
                    // onSelect={e => setStep(e.currentTarget.v)}
                    >
                        <Stepper.Step value={0} label="Select Asset">
                            <TextInput radius="xl" size='md' placeholder='Search Asset' />
                            <ScrollArea style={{ height: "200px" }}>
                                <Paper px="xs" py="xs" sx={theme => ({
                                    background: "transparent"
                                })}>
                                    Assets will go here.
                                </Paper>
                            </ScrollArea>
                        </Stepper.Step>
                        <Stepper.Step value={1} label="Make The Withdrawal">
                            <NumberInput value={amount} onChange={value => setAmount(value)} radius="xl" size='md' placeholder='Enter Amount' min={1} />
                            <Center style={{ height: "200px" }}>
                                <Stack align="center" spacing={0}>
                                    <Title order={2}>Amount To Withdraw</Title>
                                    <Title color="green.6">{amount}</Title>
                                    <Title order={4} color="green.6">Near</Title>
                                    <Text color="red" size="sm">Amount is larger than asset balance.</Text>
                                </Stack>
                            </Center>
                        </Stepper.Step>
                    </Stepper>
                </Paper>
                <Group mt="md" position='center'>
                    <Button radius="xl" color="violet"
                        style={{ width: "100px", height: "42px" }}
                        leftIcon={<IconArrowBack />}
                        disabled={step === 0}
                        onClick={e => setStep(0)}>
                        Back
                    </Button>
                    {
                        step === 0 && (
                            <Button radius="xl" color="violet"
                                style={{ width: "100px", height: "42px" }}
                                rightIcon={<IconArrowForward />}
                                onClick={e => setStep(1)}
                            >
                                Next
                            </Button>
                        )}
                    {step === 1 && (
                        <Button radius="xl" color="violet"
                            style={{ height: "42px" }}
                            rightIcon={<IconCurrencyDollar />}
                        >
                            Withdraw
                        </Button>
                    )}
                </Group>
            </Modal>
        </>
    )
}

export default WithdrawModal