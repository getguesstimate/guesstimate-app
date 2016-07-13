import {regexBasedFormatter, POINT_REGEX} from './lib.js'

export const item = {
  formatterName: 'DISTRIBUTION_POINT_TEXT',
  guesstimateType() { return 'POINT' },
  ...regexBasedFormatter(POINT_REGEX, () => []),
}

