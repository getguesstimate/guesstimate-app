import { AnyAction, Reducer } from "redux";

const emptyState = {
  componentName: false,
  props: {},
};

const modal: Reducer<typeof emptyState, AnyAction> = (
  state = emptyState,
  action: AnyAction
) => {
  switch (action.type) {
    case "MODAL_CHANGE":
      const { componentName, props } = action;
      return { componentName, props };
    case "MODAL_CLOSE":
      return emptyState;
    default:
      return state;
  }
};

export default modal;
