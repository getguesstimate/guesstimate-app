export const item = {
  guesstimateType: 'NONE',
  inputType: 'NONE',
  formatterName: 'NULL',
  matches(g) { return true },
  format(g) { return {guesstimateType: 'NONE'} },
  errors({text}) { return _.isEmpty(text) ? [] : ['unrecognized input format'] },
}
