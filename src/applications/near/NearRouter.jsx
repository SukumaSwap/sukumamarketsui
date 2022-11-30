import React, { useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'
import MarketWrapper from './../MarketWrapper';
import NearDashboard from './pages/NearDashboard';
import Buy from './pages/buy/Buy';
import UserAccount from './pages/account/UserAccount';
import CreateBuyTrade from './pages/buy/CreateBuyTrade';
import TradeChat from './pages/chats/TradeChat';
import Transfers from './pages/transfers/Transfers';
import Offers from './pages/offers/Offers';
import TradeChats from './pages/chats/TradeChats';

import CommunityWrapper from './../community/CommunityWrapper';
import CommunityChats from './../community/chats/CommunityChats';
import SingleChat from './../community/chats/SingleChat';
import SingleGroup from './../community/groups/SingleGroup';
import CommunityForums from './../community/forums/CommunityForums';
import CommunityGroups from './../community/groups/CommunityGroups';
import SingleForum from './../community/forums/SingleForum';

import CreateOffer from './pages/offers/CreateOffer';
import Sell from './pages/sell/Sell';
import CreateTokenBuyTrade from './pages/buy/CreateTokenBuyTrade';
import TokenChat from './pages/chats/TokenChat';
import CreateSellTrade from './pages/sell/CreateSellTrade';
import CreateTokenSellTrade from './pages/sell/CreateTokenSellTrade';

import NoChatSelected from './../../components/common/NoChatSelected';

import DepositModal from './modals/DepositModal';
import WithdrawModal from './modals/WithdrawModal';

import { Title } from "@mantine/core"
import { CONTRACT } from '../../app/appconfig';
import { getState, SukMarketFunctionCall } from '../../app/nearutils';
import { showNotification } from '@mantine/notifications';
import { useState } from 'react';

const CreateNearRouter = () => {
  const [tx, setTx] = useState(null)
  const createAccount = () => {
    // Function called whenever near url is called once, to make sure the user has a registered account.
    const wallet = window.walletConnection
    const contract = window.contract

    if (wallet && contract) {
      const account_id = wallet.getAccountId()
      // contract.register_new_account({ account_id })
      SukMarketFunctionCall(wallet, {
        methodName: "register_new_account",
        args: {
          account_id
        },
        gas: 100000000000000,
        amount: "0",
      }).then(res => {
        setTx(res)
      }).catch(err => {
        console.log("error", err)
      })
    }

  }

  const readTxHashResult = () => {
    const wallet = window.walletConnection
    if(wallet){
      const account_id = wallet.getAccountId()
      getState(tx?.transaction?.hash, account_id).then(res => {
        // console.log("result: ", res)
        // if (res.trim() === "Account registered successfully".trim()) {
        //   showNotification({
        //     title: "Account Registration",
        //     message: res.trim(),
        //     color: "green.9",
        //   })
        // }
        // else if (res.trim() === "Account already registered".trim()) {
        //   showNotification({
        //     title: "Acc1ount Registration",
        //     message: res.trim(),
        //     color: "blue.9",
        //   })
        // }
      }).catch(e=>{})
    }
  }

  useEffect(() => {
    const wallet = window.walletConnection
    // console.log("Account", wallet.getAccountId())
    if(wallet.getAccountId()){
      createAccount()
    }
  }, [])

  // useEffect(() => {
  //   readTxHashResult()
  // }, [tx])

  return (
    <Route path='/near/' element={<MarketWrapper url_prefix={"near"} depositmodal={<DepositModal />}
      withdrawmodal={<WithdrawModal />} />} >
      <Route path='' element={<NearDashboard />} />

      <Route path="buy" element={<Buy />} />
      <Route path="buy/create-buy-trade/:offer_id/" element={<CreateBuyTrade />} />
      <Route path="buy/create-buy-trade/asset/:offer_id/" element={<CreateTokenBuyTrade />} />

      <Route path="sell" element={<Sell />} />
      <Route path="sell/create-sell-trade/:offer_id/" element={<CreateSellTrade />} />
      <Route path="sell/create-sell-trade/asset/:offer_id/" element={<CreateTokenSellTrade />} />

      <Route path="chats/:chat_id/" element={<TradeChat />} />
      <Route path="chats/token/:chat_id/" element={<TokenChat />} />

      <Route path="accounts/:account_id" element={<UserAccount />} />

      <Route path="trades/" element={<TradeChats />} />
      <Route path="transfers/" element={<Transfers />} />

      <Route path="offers/" element={<Offers />} />
      <Route path="offers/new/" element={<CreateOffer />} />

      <Route path="community/" element={<CommunityWrapper />}>
        <Route path='chats' element={<CommunityChats />} >
          <Route path="" element={<NoChatSelected title="No Chat Selected" msg="Please select a chat to continue" />} />
          <Route path=':single' element={<SingleChat />} />
          <Route path="*" element={<Title order={4}>Chat not found</Title>} />
        </Route>
        <Route path='forums' element={<CommunityForums />} >
          <Route path="" element={<NoChatSelected title="No Forum Selected" msg="Please select a forum to continue" />} />
          <Route path=':single' element={<SingleForum />} />
          <Route path="*" element={<Title order={4}>Forum not found</Title>} />
        </Route>
        <Route path='groups' element={<CommunityGroups />} >
          <Route path="" element={<NoChatSelected title="No Group Selected" msg="Please select a group to continue" />} />
          <Route path=':single' element={<SingleGroup />} />
          <Route path="*" element={<Title order={4}>Group not found</Title>} />
        </Route>
        <Route path="*" element={<Title order={4}>Community chat not found</Title>} />
      </Route>

      <Route path="*" element={<Title order={4}>Page not found</Title>} />
    </Route>
  )
}

export default CreateNearRouter