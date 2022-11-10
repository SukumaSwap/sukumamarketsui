import { connect, Contract, keyStores, WalletConnection } from 'near-api-js'
import { CONTRACT_CHANGE_METHODS, CONTRACT_VIEW_METHODS } from '../appconfig'
import getConfig from './config'
//wagmi imports
import { WagmiConfig, createClient } from 'wagmi'
import { getDefaultProvider } from 'ethers'



// const nearConfig = getConfig(process.env.NODE_ENV || 'development')
const nearConfig = getConfig('development')

export async function initContract() {
  const near = await connect(Object.assign({ deps: { keyStore: new keyStores.BrowserLocalStorageKeyStore() } }, nearConfig))

  window.walletConnection = new WalletConnection(near)

  window.accountId = window.walletConnection.getAccountId()

  window.contract = await new Contract(window.walletConnection.account(), nearConfig.contractName, {
    viewMethods: CONTRACT_VIEW_METHODS,
    changeMethods: CONTRACT_CHANGE_METHODS,
  })
}

export function logout() {
  window.walletConnection.signOut()
  window.location.replace(window.location.origin + window.location.pathname)
}

export function login() {
  window.walletConnection.requestSignIn(nearConfig.contractName)
}

export async function set_greeting(message){
  let response = await window.contract.set_greeting({
    args:{message: message}
  })
  return response
}

export async function get_greeting(){
  let greeting = await window.contract.get_greeting()
  return greeting
}