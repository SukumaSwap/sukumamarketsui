import React from 'react'
import { Grid, TextInput, ScrollArea, Paper } from '@mantine/core';
import { IconBrandChrome, IconSearch } from '@tabler/icons';
import { Outlet } from 'react-router-dom';
import { getTheme } from '../../../../../app/appFunctions';
import { SingleChatLink } from '../../../../../components/common/CustomNavlink';

const CommunityForums = () => {
  return (
    <div className='h-100'>
      <Grid className='h-100'>
        <Grid.Col md={5} className='h-100' py="0">
          <TextInput icon={<IconSearch />} size='md' radius="xl" placeholder='Search Forums...' />
          <ScrollArea style={{ height: "calc(100% - 40px)" }}>
            <Paper radius="md" px="sm" pt="sm" sx={theme => ({
              background: !getTheme(theme) && theme.colors.gray[0]
            })}>
              {
                [1, 2, 3, 4, 14, 15].map((item, index) => (
                  <SingleChatLink key={`chat_${index}`} navlink={{
                    to: `./forum-${item}`,
                    label: `Forum ${item}`,
                    icon: <IconBrandChrome size={16} />,
                    description: null,
                  }} />
                ))
              }
            </Paper>
          </ScrollArea>
        </Grid.Col>
        <Grid.Col md={7} py="0" className="h-100">
          <Outlet />
        </Grid.Col>
      </Grid>
    </div >
  )
}

export default CommunityForums