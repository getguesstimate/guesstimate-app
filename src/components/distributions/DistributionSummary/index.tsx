import clsx from "clsx";
import _ from "lodash";
import React from "react";

import { numberShow } from "~/lib/numberShower/numberShower";

type Theme = "normal" | "normal-input" | "normal-output" | "large";

export const PrecisionNumber: React.FC<{
  value: number;
  precision?: number;
  number?: any;
}> = ({ value, precision, number = numberShow(value, precision) }) => (
  <span>
    {number.value}
    {number.symbol}
    {number.power && (
      <span>
        {"\u00b710"}
        <sup className="text-[0.6em]">{number.power}</sup>
      </span>
    )}
  </span>
);

export const DistributionSummary: React.FC<{
  length: number;
  mean: number | undefined;
  adjustedConfidenceInterval?: [number | null, number | null];
  precision?: number;
  theme?: Theme;
}> = ({
  length,
  mean,
  adjustedConfidenceInterval = [null, null],
  precision = 6,
  theme = "normal",
}) => {
  // TODO(matthew): Ostensibly I'd like to handle the defensivity upstream, but this is a good quick fix for the problem
  // exposed to customers presently.
  if (mean === undefined) {
    return null;
  }

  const isNumberPair = (
    pair: [number | null, number | null]
  ): pair is [number, number] => {
    return pair.every((e) => _.isFinite(e));
  };
  const showConfidenceInterval =
    length !== 1 && isNumberPair(adjustedConfidenceInterval);

  return (
    <div
      className={clsx(
        theme === "normal" && "text-2xl font-light text-grey-444",
        theme === "normal-input" && "text-grey-[#222] text-2xl font-light",
        theme === "normal-output" && "text-grey-[#111] text-2xl font-bold",
        theme === "large" && "text-4xl",
        "leading-none"
      )}
    >
      <PrecisionNumber
        value={mean}
        precision={showConfidenceInterval ? 2 : precision}
      />
      {showConfidenceInterval && (
        <div className="mt-0.5 text-[0.6em] text-[#555]">
          <PrecisionNumber value={adjustedConfidenceInterval[0]} /> to{" "}
          <PrecisionNumber value={adjustedConfidenceInterval[1]} />
        </div>
      )}
    </div>
  );
};
