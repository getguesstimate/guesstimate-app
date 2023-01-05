import { AnyAction, Reducer } from "redux";
import { Region } from "~/lib/locationUtils";
import { Guesstimate } from "../guesstimates/reducer";
import { Metric } from "../metrics/reducer";

type CopiedState = {
  metrics: Metric[];
  guesstimates: Guesstimate[];
  pastedTimes: number;
  region: Region;
} | null;

export const copiedR: Reducer<CopiedState, AnyAction> = (
  state = null,
  action
) => {
  switch (action.type) {
    case "COPY":
      return { ...action.copied, pastedTimes: 0 };
    case "PASTE":
      return { ...state, pastedTimes: (state?.pastedTimes ?? 0) + 1 };
    default:
      return state;
  }
};
