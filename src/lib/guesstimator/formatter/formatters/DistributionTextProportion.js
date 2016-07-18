import {regexBasedFormatter, rangeRegex} from './lib.js'

export const item = {
  formatterName: 'DISTRIBUTION_PROPORTIONALITY',
  ...regexBasedFormatter(rangeRegex(/of|in/), () => 'BETA'),
}
