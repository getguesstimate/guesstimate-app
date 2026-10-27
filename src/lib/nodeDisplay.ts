import type { Metric } from "~/modules/metrics/reducer";
import type { FullDenormalizedMetric } from "~/lib/engine/space";
type Guesstimate = FullDenormalizedMetric["guesstimate"];

type DisplayMetric = Pick<Metric, "name" | "showNotesOnNode"> & {
  guesstimate: Pick<
    Guesstimate,
    "input" | "data" | "description" | "guesstimateType"
  >;
};

export function hasNodeValue(
  guesstimate: Pick<Guesstimate, "input" | "data"> | undefined
) {
  return !!guesstimate?.input?.trim() || !!guesstimate?.data?.length;
}

export function nodeDisplay(metric: DisplayMetric) {
  const name = metric.name?.trim();
  const description = metric.guesstimate.description?.trim();
  const hasValue = hasNodeValue(metric.guesstimate);
  const empty = !name && !description && !hasValue;
  const note = !hasValue && !!(name || description);
  const heading =
    note && !!name && (!description || metric.showNotesOnNode === false);
  const formula = metric.guesstimate.guesstimateType === "FUNCTION";
  return { name, description, hasValue, empty, note, heading, formula };
}

const resultFormatter = new Intl.NumberFormat("en", {
  maximumSignificantDigits: 4,
});
export const formatResult = (value: number | undefined) =>
  value !== undefined && Number.isFinite(value)
    ? resultFormatter.format(value)
    : "—";
