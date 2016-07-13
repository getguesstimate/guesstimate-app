export const item = {
  formatterName: 'FUNCTION',
  matches({text}) { return !!text && text.startsWith('=') },
  errors() {return []},
  format({text}) { return {guesstimateType: 'FUNCTION', text: text.slice(1)} },
}
