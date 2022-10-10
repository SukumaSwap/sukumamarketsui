import { Center, Stack, Title } from '@mantine/core'
import {useState} from 'react'
import CustomNavLink from '../../components/common/CustomNavlink';
import { IconHome } from '@tabler/icons'

const Home = () => {
    const [changingVariable, setChangingVariable] = useState("some initila value")
    return (
        <div>
            <Center style={{
                height: '100vh'
            }}>
                <Stack>
                    <Title>Sukuma Markets</Title>
                    <CustomNavLink navlink={{
                        to: './market',
                        label: 'Get Started',
                        icon: <IconHome size={16} />,
                        description: null,
                    }} />
                </Stack>
            </Center>
        </div>
    )
}

export default Home