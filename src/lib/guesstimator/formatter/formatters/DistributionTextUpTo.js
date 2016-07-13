import {regexBasedFormatter, rangeRegex} from './lib.js'

export const item = {
  formatterName: 'DISTRIBUTION_NORMAL_TEXT_UPTO',
  ...regexBasedFormatter(rangeRegex(/to|\.\.|->|:/)),
}
