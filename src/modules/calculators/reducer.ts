import { AnyAction, Reducer } from "redux";
import reduxCrud from "redux-crud";

import { ApiCalculator } from "~/lib/guesstimate_api/resources/Calculators";

export type Calculator = Omit<ApiCalculator, "_embedded">;

type CalculatorsState = Calculator[];

export const calculatorsR: Reducer<CalculatorsState, AnyAction> =
  reduxCrud.List.reducersFor("calculators");
