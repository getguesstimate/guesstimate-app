import {regexBasedFormatter} from './lib.js'

const PROPORTION_REGEX = /^\s*(\d*(?:\.\d+)?)\s?(M|B|K|T)?\s*(?:of|in)\s*(\d*(?:\.\d+)?)\s?(M|B|K|T)?\s*$/

export const item = {
  formatterName: 'DISTRIBUTION_PROPORTIONALITY',
  guesstimateType() { return 'BETA' },
  ...regexBasedFormatter(PROPORTION_REGEX, '1 of/in 10'),
}
