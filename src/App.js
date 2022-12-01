import 'regenerator-runtime/runtime'
import { useEffect } from 'react';

import './App.css';

import { AppWrapper } from './components/layout/AppShell';

import { Outlet, Route, Routes } from 'react-router-dom';

import Home from './applications/main/Home';



import { showNotification } from '@mantine/notifications';
import CreateNearRouter from './applications/near/NearRouter';
import { CreateEthRouter} from './applications/eth/EthRouter';

const MainHome = () => {

  return (
    <>
      <Outlet />
    </>
  )
}

function App() {

  const createAccount = () => {
    // Function called whenever near url is called once, to make sure the user has a registered account.
    const contract = window.contract
    const wallet = window.walletConnection

    if (contract && wallet && contract.register_new_account) {
      contract.register_new_account({ account_id: wallet.getAccountId() }).then(res => {
        if (res.trim() === "Account registered successfully".trim()) {
          showNotification({
            title: "Account Registration",
            message: "Account registered successfully",
            color: "green.9",
          })
          // getSukumaAccount()
        }
        else if (res.trim() === "Account already registered".trim()) {
          showNotification({
            title: "Acc1ount Registration",
            message: "Account already registered",
            color: "blue.9",
          })
          // getSukumaAccount()
        }
      }).catch(err => {
        console.log("error", err)
        // showNotification({
        //   title: "Error",
        //   message: "Account registration failed",
        //   color: "red.7",
        // })
      })
    }
  }

  useEffect(() => {
    // createAccount()
  }, [])

  return (
    <AppWrapper>

      <Routes>
        <Route path='/' element={<MainHome />} >
          <Route path='/' element={<Home />} />
          {CreateNearRouter()} || { CreateEthRouter ()}
        </Route>

        

      </Routes>
    </AppWrapper>
  );
}

export default App;
