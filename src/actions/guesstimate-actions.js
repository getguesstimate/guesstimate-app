export function changeGuesstimate(id, values) {
  console.log('action', id, values)
  return { type: 'CHANGE_GUESSTIMATER', id, values };
}
