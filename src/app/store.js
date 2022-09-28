import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux'
import { persistStore, persistReducer, FLUSH, PAUSE, PURGE } from 'redux-persist'
import storage from 'redux-persist/lib/storage';
import { REHYDRATE, PERSIST, REGISTER } from 'redux-persist';

import appReducer from '../features/app/appSlice';

const persistConfig = {
  key: 'sukuma_markets_blockchain_system',
  storage,
  whitelist: ['sukuma_markets']
}

const rootReducer = combineReducers({
  sukuma_markets: appReducer,
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware => getDefaultMiddleware({
    serializableCheck: {
      ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
    },
  }),
});

const persistor = persistStore(store);
export { store, persistor }