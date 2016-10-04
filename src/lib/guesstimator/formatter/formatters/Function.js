import * as constants from 'lib/propagation/constants'

const {ERROR_TYPES: {PARSER_ERROR}, ERROR_SUBTYPES: {PARSER_ERROR_SUBTYPES: {MISSING_FUNCTION_BODY}}} = constants
// TODO(matthew): fix error messages.

export const item = {
  formatterName: 'FUNCTION',
  matches({text}) { return !!text && text.startsWith('=') },
  error({text}) { return text.length > 1 ? {} : {type: PARSER_ERROR, subType: MISSING_FUNCTION_BODY, message: 'Missing function body'}},
  format({text}) { return {guesstimateType: 'FUNCTION', text: text.slice(1)} },
}
