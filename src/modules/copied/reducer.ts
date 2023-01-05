import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AnyAction, Reducer } from "redux";
import { Region } from "~/lib/locationUtils";
import { Guesstimate } from "../guesstimates/reducer";
import { Metric } from "../metrics/reducer";

type CopiedState = {
  metrics: Metric[];
  guesstimates: Guesstimate[];
  pastedTimes: number;
  region: Region;
};

export const copiedSlice = createSlice({
  name: "copied",
  initialState: null as CopiedState | null,
  reducers: {
    copy(
      state,
      action: PayloadAction<
        Pick<CopiedState, "metrics" | "guesstimates" | "region">
      >
    ) {
      return {
        ...state,
        ...action.payload,
        pastedTimes: 0,
      };
    },
    paste(state) {
      if (state) {
        state.pastedTimes = (state?.pastedTimes ?? 0) + 1;
      }
    },
  },
});

export const copiedR = copiedSlice.reducer;
