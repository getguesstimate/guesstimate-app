export function changeSelect(location, selectedFrom) {
  return { type: 'CHANGE_SELECT', selection: {...location, selectedFrom} }
}

export function deSelect() {
  return { type: 'DE_SELECT' }
}
