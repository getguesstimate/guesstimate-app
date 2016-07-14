import {regexBasedFormatter, POINT_REGEX} from './lib.js'

export const item = {
  formatterName: 'DISTRIBUTION_POINT_TEXT',
  ...regexBasedFormatter(POINT_REGEX, () => 'POINT', () => {}),
}

