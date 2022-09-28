import { createSlice } from '@reduxjs/toolkit';
import { NETWORKS } from '../../app/appconfig';


const initialState = {
  user: null,
  loggedIn: false,
  theme: 'dark',
  network: NETWORKS[0]
};

export const appSlice = createSlice({
  name: 'sukuma_markets',
  initialState,
  reducers: {
    login: (state, action) => {
      state.user = action.payload;
      state.loggedIn = true;
    },
    logout: (state) => {
      state.user = null;
      state.loggedIn = false;
    },
    setTheme: (state, action) => {
      state.theme = action.payload;
    },
    resetTheme: (state) => {
      state.theme = 'dark';
    },

    setNetwork: (state, action) => {
      state.network = action.payload
    }
    
  }
});

export const { login, logout, setTheme, resetTheme, setNetwork } = appSlice.actions;

export const selectUser = (state) => state.sukuma_markets.user;
export const selectTheme = state => state.sukuma_markets.theme;
export const selectNetwork = state => state.sukuma_markets.network;



export default appSlice.reducer;
