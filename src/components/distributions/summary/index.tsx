import clsx from "clsx";
import _ from "lodash";
import React from "react";

import { numberShow } from "~/lib/numberShower/numberShower";

type Theme = "normal" | "large";

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
        <span className="sup">{number.power}</span>
      </span>
    )}
  </span>
);

const PointDisplay: React.FC<{
  value: number;
  precision?: number;
  theme?: Theme;
}> = ({ value, precision = 6, theme = "normal" }) => (
  <div className="mean">
    <PrecisionNumber value={value} precision={precision} />
  </div>
);

const DistributionDisplay: React.FC<{
  mean: number;
  range: [number, number];
  theme?: Theme;
}> = ({ mean, range: [low, high], theme = "normal" }) => (
  <div
    className={clsx(
      theme === "normal" && "text-2xl",
      theme === "large" && "text-4xl",
      "leading-none"
    )}
  >
    <PointDisplay value={mean} precision={2} />
    <div className="text-[#555] mt-0.5 text-[0.6em]">
      <PrecisionNumber value={low} /> to <PrecisionNumber value={high} />
    </div>
  </div>
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
  adjustedConfidenceInterval,
  precision = 6,
  theme = "normal",
}) => {
  // TODO(matthew): Ostensibly I'd like to handle the defensivity upstream, but this is a good quick fix for the problem
  // exposed to customers presently.
  if (mean === undefined) {
    return null;
  }
  return (
    <div className="DistributionSummary">
      {length === 1 ||
      _.some(adjustedConfidenceInterval, (e) => !_.isFinite(e)) ? (
        <PointDisplay value={mean} precision={precision} theme={theme} />
      ) : (
        <DistributionDisplay
          mean={mean}
          range={adjustedConfidenceInterval as [number, number]}
          theme={theme}
        />
      )}
    </div>
  );
};
