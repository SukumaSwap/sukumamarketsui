import { CURRENCIES, PAYMENT_METHODS } from "./appconfig";

const validateUrl = (url) => {
  const pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
    '(\\:\\d+)?' + // port
    '(\\/[-a-z\\d%@_.~+&:]*)*' + // path
    '(\\?[;&a-z\\d%@_.,~+&:=-]*)?' + // query string
    '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
  return pattern.test(url);
}

const getPathMatch = (base, path) => {
  const pattern = new RegExp(`\/${base}\/*`)
  return pattern.test(path);
}

const getTextCount = (text, count) => {
  if (text.length > count) {
    return `${text.substring(0, count)}...`
  }
  return text
}

const getTheme = (theme) => {
  if (theme.colorScheme === 'dark') {
    return true
  }
  return false
}

const greenGradientBg = (theme) => {
  return theme.fn.linearGradient(45, theme.colors.green[1], theme.colors.green[3], theme.colors.green[1])
}

const formatNumber = (num) => {
  return new Number(num).toLocaleString('en-US', { minimumFractionDigits: 2 })
}


export const convertNstoTime = (nanoseconds, full) => {
  if (nanoseconds) {
    const millis = parseInt((nanoseconds / 1000000))
    const time = new Date(millis)
    if (!full) {
      return time.toDateString() + " " + time.toLocaleTimeString()
    }
    return time.toDateString()
  }
  return "-"
}

export const getCurrency = (symbol) => {
  return CURRENCIES.find(cur => cur.symbol === symbol)
}

export const getCurrencies = (symbols_array) => {
  let currencies = []
  symbols_array.forEach(s => {
    let curr = CURRENCIES.find(cur => cur.symbol === s)
    currencies.push(curr)
  })

  return currencies
}

export const getPaymentMethods = (symbols_array) => {
  let methods = []
  symbols_array.forEach(s => {
    let obj = PAYMENT_METHODS.find(o => o.name === s)
    methods.push(obj)
  })

  return methods
}


export default validateUrl;
export { getPathMatch, getTextCount, getTheme, greenGradientBg, formatNumber }