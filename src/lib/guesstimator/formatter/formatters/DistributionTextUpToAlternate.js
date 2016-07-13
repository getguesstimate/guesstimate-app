import {getGuesstimateType, regexBasedFormatter} from './lib.js'

const RANGE_REGEX = /^\s*\[\s*(\d*(?:\.\d+)?)\s?(M|B|K|T)?,\s*(\d*(?:\.\d+)?)\s?(M|B|K|T)?\s*\]\s*$/

export const item = {
  formatterName: 'DISTRIBUTION_NORMAL_TEXT_UPTO',
  guesstimateType(type, [low]) { return getGuesstimateType(type, low) },
  ...regexBasedFormatter(RANGE_REGEX, '[1, 10]'),
}
