import { Modal, Title, Text, Button, Chip, Group } from '@mantine/core'
import { IconRegistered } from '@tabler/icons';
import BigNumber from 'bignumber.js';
import React from 'react'
import { useState, useEffect } from 'react';
import { CONTRACT } from '../../../app/appconfig';

const RegisterContractModal = ({ token }) => {
    const [registering, setRegistering] = useState(false)
    const [FtAccountModal, setFtAccountModal] = useState(false)

    const registerContract = () => {
        const wallet = window.walletConnection
        const amt = new BigNumber(0.00125).multipliedBy(10 ** 24).toFixed()
        if (wallet) {
            setRegistering(true)
            wallet.account().functionCall(token, "storage_deposit", { "account_id": CONTRACT }, 100000000000000, amt).then(res => {

            }).catch(err => {

            }).then(_ => {
                setRegistering(false)
            })
        }
    }

    const getIfAccountIsRegisteredWithAsset = () => {
        const wallet = window.walletConnection;
        if (wallet) {
            if (token !== "near") {
                setFtAccountModal(false)
                wallet.account().viewFunction(token, "ft_balance_of", { account_id: CONTRACT }).then(res => {
                    if (res === "0") {
                        setFtAccountModal(true)
                    }
                }).catch(err => {
                })
            }
        }
    }


    useEffect(() => {
        getIfAccountIsRegisteredWithAsset()
        console.log(token)
    }, [token])

    return (
        <Modal
            zIndex={2000}
            opened={FtAccountModal}
            title="Register contract"
            radius="lg"
            size="xl"
            transition="fade"
            // style={{ height: "70vh" }}
            onClose={e => setFtAccountModal(false)} >
            <Title order={3} align="center">Contract not registered with this asset.</Title>
            <Text align='center' mt="sm">
                Sukuma Markets is a defi p2p market place and you can trade any sort of asset
                on this platform.
            </Text>
            <Text align='center' my="md">
                To help keep this defi, we kindly ask you to register the contract before you start trading on this
                asset - <Chip checked={true} title={token} variant="filled" color="teal">{token}</Chip>
            </Text>
            <Group position='center'>
                <Button radius="xl" variant='light' loading={registering} onClick={registerContract} rightIcon={<IconRegistered />}>{registering ? "Registering" : "Register here"}</Button>
            </Group>
        </Modal>
    )
}

export default RegisterContractModal