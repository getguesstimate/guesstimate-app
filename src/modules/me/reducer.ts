import { ApiUser } from "~/lib/guesstimate_api/resources/Users";
import { AnyAction, Reducer } from "redux";

type MeProfileFields = {
  needs_tutorial: boolean;
  plan: {
    id: string;
    name: string;
    private_model_limit?: number;
  };
  account: {
    id: number;
    _links: {
      payment_portal: {
        href: string;
      };
    };
  };
};

type MeState = Partial<{
  token: string;
  id: number;
  profile: ApiUser & MeProfileFields;
}>;

export const meR: Reducer<MeState, AnyAction> = function (state = {}, action) {
  switch (action.type) {
    case "AUTH0_ME_LOADED":
      return {
        token: action.token,
        profile: action.profile,
        id: state.id,
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
        profile: action.profile,
        id: action.id,
      };
    case "DESTROY_ME":
      return {};
    default:
      return state;
  }
};
