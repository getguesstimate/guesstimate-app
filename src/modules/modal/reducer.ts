import { AnyAction, Reducer } from "redux";

export type ModalState = {
  componentName: string | undefined;
  props: any; // FIXME
};

const emptyState: ModalState = {
  componentName: undefined,
  props: {},
};

const modal: Reducer<ModalState, AnyAction> = (
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
