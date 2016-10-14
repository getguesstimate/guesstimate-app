export function formatData(value) {
  return value
    .replace(/[\[\]]/g, '')
    .split(/[\n\s,]+/)
    .filter(e => !_.isEmpty(e))
    .map(Number)
    .filter(e => _.isFinite(e))
    .slice(0, 10000)
}

export const isData = input => !input.includes('=') && (input.match(/[\n\s,]/g) || []).length > 3

export const item = {
  formatterName: 'DATA',
  error(g) { return {} },
  matches(g) { return !_.isEmpty(g.data) },
  format(g) { return { guesstimateType: 'DATA', data: g.data } },
}
