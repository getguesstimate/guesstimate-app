export function selectedCellR(state = {}, action) {
  switch (action.type) {
    case "CHANGE_SELECT":
      return action.selection;
    case "DE_SELECT":
      return {};
    default:
      return state;
  }
}
