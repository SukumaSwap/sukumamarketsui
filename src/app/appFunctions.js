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
  return new Number(num).toLocaleString('en-US', {minimumFractionDigits: 2})
}


export const convertNstoTime = (nanoseconds) => {
  if (nanoseconds) {
    const millis = parseInt((nanoseconds / 1000000))
    const time = new Date(millis)
    return time.toDateString() + " " + time.toLocaleTimeString()
  }
  return "-"
}


export default validateUrl;
export { getPathMatch, getTextCount, getTheme, greenGradientBg, formatNumber }