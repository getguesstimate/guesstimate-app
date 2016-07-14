import {PARSER_ERROR} from 'lib/errors/modelErrors'

export const item = {
  formatterName: 'FUNCTION',
  matches({text}) { return !!text && text.startsWith('=') },
  error({text}) { return text.length > 1 ? {} : {type: PARSER_ERROR, message: 'Missing function body'}},
  format({text}) { return {guesstimateType: 'FUNCTION', text: text.slice(1)} },
}
