const PREFIXES = {
  'K': 3,
  'M': 6,
  'B': 9,
  'T': 12,
}

// We assume that if the user started at 0 or tried a negative number,
// they intended for this to be normal.
const isNotLogNormal = low => (isFinite(low) && (low <= 0))

export function getGuesstimateType(guesstimateType, low) {
  switch (guesstimateType) {
    case 'UNIFORM':
      return guesstimateType
    case 'NORMAL':
      return guesstimateType
    case 'LOGNORMAL':
      return isNotLogNormal(low) ? 'NORMAL' : 'LOGNORMAL'
    default:
      if (!isFinite(low)) { return 'LOGNORMAL' }
      return isNotLogNormal(low) ? 'NORMAL' : 'LOGNORMAL'
  }
}

const getMult = prefix => Math.pow(10,PREFIXES[prefix])
export const parseNumber = (num, suffix) => parseFloat(num) * (!!suffix ? getMult(suffix) : 1)

export const regexBasedFormatter = (re, syntax) => ({
  matches({text}) { return re.test(text) },
  errors({text}) {
    const [low, high] = this._numbers(text)

    if (!low || !high) {
      return [`Syntax is '${syntax}'`]
    } else if (high < low) {
      return [`${high} should be > ${low}`]
    }
    return []
  },
  format({guesstimateType, text}) {
    const params = this._numbers(text)
    return {guesstimateType: this.guesstimateType(guesstimateType, params), params}
  },

  _numbers(text) { return _.chunk(text.match(re).slice(1), 2).map(([num, suffix]) => parseNumber(num, suffix)) },
})
