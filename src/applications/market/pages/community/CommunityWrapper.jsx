import { Grid } from '@mantine/core'
import { IconBrandChrome } from '@tabler/icons'
import React from 'react'
import { Outlet } from 'react-router-dom'
import { CustomNavLinkEnd } from '../../../../components/common/CustomNavlink'

const CommunityWrapper = () => {
    return (
        <div>
            <Grid py="xs">
                <Grid.Col md={5}>
                    <Grid>
                        <Grid.Col xs={4}>
                            <CustomNavLinkEnd navlink={{
                                to: './chats',
                                label: 'Chats',
                                icon: <IconBrandChrome size={16} />,
                                description: null,
                            }} />
                        </Grid.Col>
                        <Grid.Col xs={4}>
                            <CustomNavLinkEnd navlink={{
                                to: './forums',
                                label: 'Forums',
                                icon: <IconBrandChrome size={16} />,
                                description: null,
                            }} />
                        </Grid.Col>
                        <Grid.Col xs={4}>
                            <CustomNavLinkEnd navlink={{
                                to: './groups',
                                label: 'Groups',
                                icon: <IconBrandChrome size={16} />,
                                description: null,
                            }} />
                        </Grid.Col>
                    </Grid>
                </Grid.Col>
            </Grid>
            <div style={{ height: "81vh", padding: "0 !important" }}>
                <Outlet />
            </div>
        </div >
    )
}

export default CommunityWrapper