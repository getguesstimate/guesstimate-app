import {getGuesstimateType, regexBasedFormatter, rangeRegex} from './lib.js'

export const item = {
  formatterName: 'DISTRIBUTION_NORMAL_TEXT_UPTO',
  guesstimateType(type, [low]) { return getGuesstimateType(type, low) },
  ...regexBasedFormatter(rangeRegex(/,\s?/, /\[/, /\]/)),
}
