import {regexBasedFormatter, rangeRegex} from './lib.js'

export const item = {
  formatterName: 'DISTRIBUTION_PROPORTIONALITY',
  guesstimateType() { return 'BETA' },
  ...regexBasedFormatter(rangeRegex(/of|in/)),
}
