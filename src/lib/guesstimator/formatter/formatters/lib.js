const SUFFIXES = {
  'K': 3,
  'M': 6,
  'B': 9,
  'T': 12,
}

const SUFFIX_REGEX = new RegExp(Object.keys(SUFFIXES).join('|'))
const INTEGER_REGEX = /\d+(?!\.)/
const DECIMAL_REGEX = /\d*(?:\.\d+)+/
const NUMBER_REGEX = new RegExp(`(-?(?:${INTEGER_REGEX.source})|(?:${DECIMAL_REGEX}))\\s?(${SUFFIX_REGEX.source})?`)

const spaceSep = res => new RegExp(res.filter(re => !!re).map(re => `(?:${re.source})`).join('\\s*'))
const padded = res => spaceSep([/^/, ...res, /$/])

export const POINT_REGEX = padded([NUMBER_REGEX])
export const rangeRegex = (sep, left, right) => padded([left, NUMBER_REGEX, sep, NUMBER_REGEX, right])

const getMult = suffix => Math.pow(10,SUFFIXES[suffix])
const parseNumber = (num, suffix) => parseFloat(num) * (!!suffix ? getMult(suffix) : 1)

const rangeErrorFn = ([low, high]) => low > high ? ['the low number should come first'] : []

// We assume that if the user started at 0 or tried a negative number,
// they intended for this to be normal.
function getGuesstimateType(guesstimateType, [low]) {
  switch (guesstimateType) {
    case 'UNIFORM': return guesstimateType
    case 'NORMAL': return guesstimateType
    default: return low <= 0 ? 'NORMAL' : 'LOGNORMAL'
  }
}

export function regexBasedFormatter(re, guesstimateTypeFn = getGuesstimateType, errorFn = rangeErrorFn) {
  return {
    matches({text}) { return re.test(text) },
    errors({text}) { return errorFn(this._numbers(text)) },

    format({guesstimateType, text}) {
      const params = this._numbers(text)
      return {guesstimateType: guesstimateTypeFn(guesstimateType, params), params}
    },

    _numbers(text) { return _.chunk(text.match(re).slice(1), 2).map(([num, suffix]) => parseNumber(num, suffix)) },
  }
}
