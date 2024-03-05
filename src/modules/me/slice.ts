import { Session } from "next-auth";
import { ApiUser } from "~/lib/guesstimate_api/resources/Users";

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

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
      session: null;
      profile: undefined;
    }
  | {
      tag: "SIGNED_IN_LOADING_PROFILE";
      session: Session;
      profile: undefined;
    }
  | {
      tag: "SIGNED_IN";
      session: Session;
      profile: MeProfile;
    };

export const meSlice = createSlice({
  name: "me",
  initialState: {
    tag: "SIGNED_OUT",
    profile: undefined,
    session: null,
  } as MeState,
  reducers: {
    setSession(state, action: PayloadAction<Session>) {
      // TODO - this could be simplified.
      return state.profile
        ? {
            tag: "SIGNED_IN",
            profile: state.profile,
            session: action.payload,
          }
        : {
            tag: "SIGNED_IN_LOADING_PROFILE", // setSession action has fired fetchMe
            profile: state.profile,
            session: action.payload,
          };
    },
    setProfile(state, action: PayloadAction<{ profile: MeProfile }>) {
      if (state.tag === "SIGNED_OUT") {
        return state;
      }
      return {
        ...state,
        tag: "SIGNED_IN",
        profile: action.payload.profile,
      };
    },
    destroy() {
      return { tag: "SIGNED_OUT", profile: undefined, session: null };
    },
  },
});
