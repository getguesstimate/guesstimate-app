import _ from "lodash";
import { Formatter } from "../types";

export function formatData(value: string): number[] {
  return value
    .replace(/[\[\]]/g, "")
    .split(/[\n\s,]+/)
    .filter((e) => !_.isEmpty(e))
    .map(Number)
    .filter((e) => _.isFinite(e))
    .slice(0, 10000);
}

export const isData = (input: string): boolean =>
  !input.includes("=") && (input.match(/[\n\s,]/g) || []).length > 3;

export const item: Formatter = {
  formatterName: "DATA",
  error() {
    return undefined;
  },
  matches(g) {
    return !_.isEmpty(g.data);
  },
  format(g) {
    return { guesstimateType: "DATA", data: g.data };
  },
};
