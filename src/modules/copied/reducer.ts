import { AnyAction, Reducer } from "redux";

type CopiedState = any;

export const copiedR: Reducer<CopiedState, AnyAction> = (
  state = null,
  action
) => {
  switch (action.type) {
    case "COPY":
      return { ...action.copied, pastedTimes: 0 };
    case "PASTE":
      return { ...state, pastedTimes: state.pastedTimes + 1 };
    default:
      return state;
  }
};
