import _ from "lodash";
import React from "react";

import { numberShow } from "~/lib/numberShower/numberShower";

const PrecisionNumber: React.FC<{
  value: number;
  precision?: number;
  number?: any;
}> = ({ value, precision, number = numberShow(value, precision) }) => (
  <span>
    {number.value}
    {number.symbol}
    {number.power && (
      <span>
        {`\u00b710`}
        <span className="sup">{number.power}</span>
      </span>
    )}
  </span>
);

const PointDisplay = ({ value, precision = 6 }) => (
  <div className="mean">
    <PrecisionNumber value={value} precision={precision} />
  </div>
);

const DistributionDisplay = ({ mean, range: [low, high] }) => (
  <div>
    <PointDisplay value={mean} precision={2} />
    <div className="UncertaintyRange">
      <PrecisionNumber value={low} /> to <PrecisionNumber value={high} />
    </div>
  </div>
);

// TODO(matthew): Ostensibly I'd like to handle the defensivity upstream, but this is a good quick fix for the problem
// exposed to customers presently.
export const DistributionSummary = ({
  length,
  mean,
  adjustedConfidenceInterval,
  precision = 6,
}) => (
  <div className="DistributionSummary">
    {length === 1 ||
    _.some(adjustedConfidenceInterval, (e) => !_.isFinite(e)) ? (
      <PointDisplay value={mean} precision={precision} />
    ) : (
      <DistributionDisplay mean={mean} range={adjustedConfidenceInterval} />
    )}
  </div>
);
