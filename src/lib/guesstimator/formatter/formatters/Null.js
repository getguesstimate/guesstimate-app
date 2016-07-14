import {PARSER_ERROR} from 'lib/errors/modelErrors'

export const item = {
  guesstimateType: 'NONE',
  inputType: 'NONE',
  formatterName: 'NULL',
  matches(g) { return true },
  format(g) { return {guesstimateType: 'NONE'} },
  error({text}) { return _.isEmpty(text) ? {} : {type: PARSER_ERROR, message: 'Improper syntax'} },
}
