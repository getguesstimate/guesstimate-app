import type { Reducer } from "react";
import type { Calculator } from "~/modules/calculators/reducer";
import * as elev from "~/server/elev/index";

export type ModelToolState =
  | {
      type: "CLOSED";
    }
  | {
      type: "NEW_CALCULATOR_FORM";
    }
  | {
      type: "EDIT_CALCULATOR_FORM";
      editCalculatorId: number;
    }
  | {
      type: "SHOW_CALCULATOR";
      showCalculatorId: number;
      showCalculatorResults?: boolean;
    }
  | {
      type: "FACT_SIDEBAR";
    };

export type ModelToolAction =
  | {
      type: "CLOSE";
    }
  | {
      type: "OPEN";
      payload: ModelToolState;
    }
  | {
      type: "SHOW_CALCULATOR";
      payload: Calculator;
    }
  | {
      type: "MAKE_NEW_CALCULATOR";
    }
  | {
      type: "TOGGLE_FACTS";
    };

export const modelToolReducer: Reducer<ModelToolState, ModelToolAction> = (
  state,
  action
) => {
  const close = () => {
    elev.show();
    return { type: "CLOSED" } as const;
  };
  const open = (newState: ModelToolState) => {
    elev.hide();
    return newState;
  };

  switch (action.type) {
    case "CLOSE":
      return close();
    case "OPEN":
      return open(action.payload);
    case "SHOW_CALCULATOR":
      return open({
        type: "SHOW_CALCULATOR",
        showCalculatorId: action.payload.id,
      });
    case "MAKE_NEW_CALCULATOR":
      return open({ type: "NEW_CALCULATOR_FORM" });
    case "TOGGLE_FACTS":
      if (state.type !== "FACT_SIDEBAR") {
        return open({ type: "FACT_SIDEBAR" });
      } else {
        return close();
      }
    default: // never
      return state;
  }
};
