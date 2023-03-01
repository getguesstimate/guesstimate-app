import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ApiUser } from "~/lib/guesstimate_api/resources/Users";

type MeProfileFields = {
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

type MeState = Partial<{
  token: string;
  profile: ApiUser & MeProfileFields;
}>;

export const meSlice = createSlice({
  name: "me",
  initialState: {} as MeState,
  reducers: {
    setToken(state, action: PayloadAction<{ token: string }>) {
      state.token = action.payload.token;
    },
    setProfile(
      state,
      action: PayloadAction<{ profile: any }> // FIXME
    ) {
      state.profile = action.payload.profile;
    },
    init(_, action: PayloadAction<{ token: string; profile: any }>) {
      return action.payload;
    },
    destroy() {
      return {};
    },
  },
});
