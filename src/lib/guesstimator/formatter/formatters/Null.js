import * as constants from 'lib/propagation/constants'

const {ERROR_TYPES: {PARSER_ERROR}, ERROR_SUBTYPES: {PARSER_ERROR_SUBTYPES: {NULL_WITH_TEXT_ERROR}}} = constants
// TODO(matthew): fix error messages.

export const item = {
  guesstimateType: 'NONE',
  inputType: 'NONE',
  formatterName: 'NULL',
  matches(g) { return true },
  format(g) { return {guesstimateType: 'NONE'} },
  error({text}) { return _.isEmpty(text) ? {} : {type: PARSER_ERROR, subType: NULL_WITH_TEXT_ERROR, message: 'Improper syntax'} },
}
