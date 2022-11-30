import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { persistor, store } from './app/store';
import App from './App';
import reportWebVitals from './reportWebVitals';
import './index.css';
import { PersistGate } from 'redux-persist/integration/react';
import { initContract } from './app/near/utils';

import * as buffer from "buffer"
window.Buffer = buffer.Buffer;

const container = document.getElementById('root');
const root = createRoot(container);

const APP_TO_RENDER = () => {
  return (
    <React.StrictMode>
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  </React.StrictMode>
  )
}

// root.render(
//   <React.StrictMode>
//     <Provider store={store}>
//       <PersistGate persistor={persistor}>
//         <App />
//       </PersistGate>
//     </Provider>
//   </React.StrictMode>
// );


window.nearInitPromise = initContract()
  .then(() => {
    <APP_TO_RENDER />
    root.render(<APP_TO_RENDER />)
  })
  .catch(console.error)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
