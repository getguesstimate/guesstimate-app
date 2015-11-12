export const item = {
  guesstimateType: 'NONE',
  inputType: 'NONE',
  formatterName: 'NULL',
  matches(g) { return true },
  format(g) { return {guesstimateType: 'NONE'} },
  errors(g) { return ['Invalid'] },
}
