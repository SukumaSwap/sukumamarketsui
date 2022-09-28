import { BigNumber } from "bignumber.js"
import { TOKEN_DETAILS, WHITELISTEDTOKENS_ } from "./appconfig";

const nearAPI = require("near-api-js");

export const calculateNear = (yoctoNear) => {
  if (yoctoNear) {
    const yoctos = new BigNumber(yoctoNear).toFixed()
    return nearAPI.utils.format.formatNearAmount(yoctos)
  }
  return "0"
}

export const getYoctoNear = (near) => {
  if (near) {
    // const nears = new BigNumber(near).toFixed()
    return nearAPI.utils.format.parseNearAmount(near)
  }
  return "0"
}

export const getTokenDecimals = (tokenId) => {
  if (Object.keys(TOKEN_DETAILS).includes(tokenId)) {
    return TOKEN_DETAILS[tokenId].decimals
  }
  return 0
}

export const getTokenDetails = (tokenId) => {
  const token = WHITELISTEDTOKENS_.find(token => token.address === tokenId)
  return token;
}

export const getReadableTokenBalance = (tokenBalance, decimals) => {
  return new BigNumber(tokenBalance).dividedBy(10 ** decimals).toFixed(2)
}

export const BigNumberCompare = (num1, num2) => {
  return new BigNumber(num1).isLessThan(num2)
}

export const resolveToken = (tokenId) => {
  if (Object.keys(TOKEN_DETAILS).includes(tokenId)) {
    return TOKEN_DETAILS[tokenId].name
  }
  return tokenId.split('.')[0]
}

export const getUSD = (price, bal) => {
  if (price && bal && price !== 'N/A') {
    return new BigNumber((bal)).multipliedBy(price).toFixed(2)
  }
  return 'N/A'
}

export const getTokenPrice = async (tokenId) => {
  return fetch(`https://testnet-indexer.ref-finance.com/get-token-price?token_id=${tokenId}`,
    {
      method: 'GET',
      headers: { 'Content-type': 'application/json; charset=UTF-8' },
    }
  )
    .then((res) => res.json())
    .then((priceBody) => {
      return priceBody
    })
    .catch((err) => {
      return "N/A"
    })
};

export const calculateOfferAmt = (tokenId, amtString) => {
  if (tokenId === 'near') {
    return `${calculateNear(amtString)}`
  }
  else {
    const tokenDetails = getTokenDetails(tokenId)
    if (tokenDetails) {
      const decimals = getTokenDecimals(tokenId)
      const amt = new BigNumber(amtString).dividedBy(10 ** decimals)
      return `${amt} ${tokenDetails.name}`
    }
    else {
      return `${amtString} ~ not converted.`
    }
  }
}

export const getMessage = (offerType, offerRate) => {
  let msg = ""
  if (offerType === "buy" && offerRate > 0) {
    msg = <>You are creating a buy offer with a rate of <span className='custom-hi'>{offerRate}%</span>. This implies that you are buying over market price. You will pay more for tokens.</>
  }
  else if (offerType === "buy" && offerRate < 0) {
    msg = <>You are creating a buy offer with a rate of <span className='custom-hi'>{offerRate}%</span>. This implies you are buying below market price. You will pay less for tokens.</>
  }
  else if (offerType === "sell" && offerRate > 0) {
    msg = <>You are creating a sell offer with a rate of <span className='custom-hi'>{offerRate}%</span>. This implies you are selling above market price for the token. You will receive some profit above market price.</>
  }
  else if (offerType === "sell" && offerRate < 0) {
    msg = <>You are creating a sell offer with a rate of <span className='custom-hi'>{offerRate}%</span>. This implies you are selling below market price for the token. You are probably selling at a loss!</>
  }
  else if (offerRate === 0) {
    msg = <>You are creating a {offerType} offer with a rate of <span className='custom-hi'>{offerRate}%</span>. This implies there will be no price impact on the tokens you are selling/buying. Market price will prevail.</>
  }
  return msg
}

export const getMessageForClient = (offerType, offerRate) => {
  let msg = ""
  if (offerType === "buy" && offerRate > 0) {
    msg = <>You are entering a trade offer with a rate of <span className='custom-hi'>{offerRate}%</span>. This implies that you are buying over market price. You will get more for your tokens.</>
  }
  else if (offerType === "buy" && offerRate < 0) {
    msg = <>You are entering a trade offer with a rate of <span className='custom-hi'>{offerRate}%</span>. This implies you are selling below market price. You will get less amount for your tokens.</>
  }
  else if (offerType === "sell" && offerRate > 0) {
    msg = <>You are entering a trade offer with a rate of <span className='custom-hi'>{offerRate}%</span>. This implies you are buying above market price for the token. You will receive less tokens for your amount.</>
  }
  else if (offerType === "sell" && offerRate < 0) {
    msg = <>You are entering a trade offer with a rate of <span className='custom-hi'>{offerRate}%</span>. This implies you are buying below market price for the token. You are probably buying at a profit!</>
  }
  else if (offerRate === 0) {
    msg = <>You are entering a trade offer with a rate of <span className='custom-hi'>{offerRate}%</span>. This implies there will be no price impact on the tokens you are selling/buying. Market price will prevail.</>
  }
  return msg
}

export const calcOfferRate = (offer_rate, tokenprice) => {
  let sellerRate = offer_rate
  if (tokenprice === 'N/A') {
    return 'N/A'
  }
  else {
    if (sellerRate < 0) {
      tokenprice = tokenprice * -1
    }
    const rate = parseFloat(tokenprice) + (parseFloat(tokenprice) * parseFloat(sellerRate) / 100)
    return parseFloat(rate < 0 ? rate * -1 : rate).toFixed(4)
  }
}


export const makeTokens = (tokensObject) => {
  const tokens_ = []
  if (tokensObject) {
    Object.keys(tokensObject).map(key => {
      tokens_.push({
        tokenId: key,
        balance: tokensObject[key]
      })
    })
  }
  return tokens_
}