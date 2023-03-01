import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ApiUser } from "~/lib/guesstimate_api/resources/Users";

export type MeProfile = ApiUser & {
  needs_tutorial: boolean;
  has_payment_account?: boolean;
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

type MeState =
  | {
      tag: "SIGNED_OUT";
      profile: undefined;
    }
  | {
      tag: "SIGNED_IN_LOADING_PROFILE";
      token: string;
      auth0_id: string;
      profile: undefined;
    }
  | {
      tag: "SIGNED_IN";
      token: string;
      auth0_id: string;
      profile: MeProfile;
    };

export const meSlice = createSlice({
  name: "me",
  initialState: { tag: "SIGNED_OUT", profile: undefined } as MeState,
  reducers: {
    setAuth0(_, action: PayloadAction<{ token: string; auth0_id: string }>) {
      return {
        tag: "SIGNED_IN_LOADING_PROFILE",
        profile: undefined,
        ...action.payload,
      };
    },
    setProfile(state, action: PayloadAction<{ profile: MeProfile }>) {
      if (state.tag === "SIGNED_OUT") {
        return state;
      }
      const { profile } = action.payload;
      // FIXME - profile doesn't always contain auth0_id
      //   if (state.auth0_id !== profile.auth0_id) {
      //     return state; // throw error?
      //   }
      return {
        ...state,
        tag: "SIGNED_IN",
        profile,
      };
    },
    destroy() {
      return { tag: "SIGNED_OUT", profile: undefined };
    },
  },
});
