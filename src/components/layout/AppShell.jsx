import { useState, useEffect } from 'react';
import { MantineProvider, ColorSchemeProvider } from '@mantine/core';
import { BrowserRouter } from 'react-router-dom';
import { NotificationsProvider } from '@mantine/notifications';
import { ModalsProvider } from '@mantine/modals';
import { useSelector } from 'react-redux';
import { selectTheme } from '../../features/app/appSlice';

export function AppWrapper({ children }) {

  const [colorScheme, setColorScheme] = useState('dark');
  const theme = useSelector(selectTheme)

  const toggleColorScheme = (value) => {
    setColorScheme(value)
  }


  useEffect(() => {
    setColorScheme(theme);
  }, [theme])

  return (
    <BrowserRouter>
      <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
        <MantineProvider theme={{ colorScheme, fontFamily: 'Mukta' }} withGlobalStyles withNormalizeCSS>
          <ModalsProvider>
            <NotificationsProvider>
              {children}
            </NotificationsProvider>
          </ModalsProvider>
        </MantineProvider>
      </ColorSchemeProvider>
    </BrowserRouter>
  );
}