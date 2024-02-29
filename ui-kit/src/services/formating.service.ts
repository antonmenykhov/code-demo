function getFormateValue(value: number, ed = 1, numbersAfterDot = 2) {
  if (value === 0) return '(Пусто)';
  function getFromated(value: string) {
    const [_, num, suffix] = value.match(
      /^(.*?)((?:[,.]\d+)?|)$/,
    ) as RegExpMatchArray;
    return `${num.replace(/\B(?=(?:\d{3})*$)/g, ' ')}${suffix}`;
  }
  return getFromated(`${(value * ed).toFixed(numbersAfterDot)}`);
}

function getNumberFromFormattedValue(formatedValue: string) {
  return +formatedValue.split(' ').join('');
}

export { getFormateValue, getNumberFromFormattedValue };
