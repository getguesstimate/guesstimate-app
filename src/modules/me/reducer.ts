import { AnyAction, Reducer } from "redux";

type MeState = Partial<{
  token: string;
  id: string;
  profile: unknown;
}>;

const me: Reducer<MeState, AnyAction> = function (state = {}, action) {
  switch (action.type) {
    case "AUTH0_ME_LOADED":
      return {
        token: action.token,
        profile: action.profile,
        id: state.id || null,
      };
    case "GUESSTIMATE_ME_LOADED":
      return {
        token: state.token,
        id: action.id,
        profile: action.profile,
      };
    case "ALL_OF_ME_RELOADED":
      return {
        token: action.token,
        id: action.id,
        profile: action.profile,
      };
    case "DESTROY_ME":
      return {};
    default:
      return state;
  }
};

export default me;
