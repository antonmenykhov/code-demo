function formatNumberValue(
  value: number,
  numberFormatingEd: number,
  numberFormatingRazryad: number
) {
  function getFromated(value: string) {
    const [_, num, suffix] = value.match(/^(.*?)((?:[,.]\d+)?|)$/) as RegExpMatchArray
    return `${num.replace(/\B(?=(?:\d{3})*$)/g, ' ')}${suffix}`
  }
  return getFromated(`${(value * numberFormatingEd).toFixed(numberFormatingRazryad)}`)
}

function parseFormatedValue(value: string) {
  return +value.split(' ').join('')
}

export { formatNumberValue, parseFormatedValue }
