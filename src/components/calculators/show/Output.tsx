import _ from "lodash";
import React, { useState } from "react";

import { numberShow } from "~/lib/numberShower/numberShower";

import { FullDenormalizedMetric } from "~/lib/engine/space";

const ToggleIcon: React.FC<{ isOpen: boolean; open(): void }> = ({
  isOpen,
  open,
}) => (
  <div
    className="absolute right-1 -top-1 bg-grey-ccc hover:bg-grey-bbb rounded-full w-6 h-6 text-center color-666 text-sm cursor-pointer grid place-items-center"
    onClick={open}
  >
    {isOpen ? <i className="ion-md-close" /> : "?"}
  </div>
);

const PrecisionNumber: React.FC<{ value: number; precision?: number }> = ({
  value,
  precision,
}) => {
  const number = numberShow(value, precision);
  return (
    <span className="text-grey-444 font-bold text-xl leading-none">
      {number.value}
      {number.symbol}
      {number.power && (
        <span>
          {`\u00b710`}
          <sup>{number.power}</sup>
        </span>
      )}
    </span>
  );
};

const RangeDisplay: React.FC<{ range: [number, number] }> = ({
  range: [low, high],
}) => (
  <div>
    <PrecisionNumber value={low} /> to <PrecisionNumber value={high} />
  </div>
);

const ResultSection: React.FC<any> = ({
  length,
  mean,
  adjustedConfidenceInterval,
}) =>
  length === 1 ? (
    <PrecisionNumber value={mean} precision={6} />
  ) : (
    <RangeDisplay range={adjustedConfidenceInterval} />
  );

const AnalyticsSection: React.FC<any> = (stats) => (
  <div className="text-sm leading-relaxed">
    According to the model, this value has a 90% chance of being between{" "}
    <PrecisionNumber value={stats.adjustedConfidenceInterval[0]} /> and{" "}
    <PrecisionNumber value={stats.adjustedConfidenceInterval[1]} />. The mean
    value is <PrecisionNumber value={stats.mean} /> and the median is{" "}
    <PrecisionNumber value={stats.percentiles[50]} />.
  </div>
);

export const Output: React.FC<{ metric: FullDenormalizedMetric }> = ({
  metric: { name, simulation },
}) => {
  const [showAnalysis, setShowAnalysis] = useState(false);

  const toggleAnalysis = () => {
    setShowAnalysis(!showAnalysis);
  };

  return (
    <div className="md:grid md:grid-cols-12">
      <div className="md:col-span-7 font-bold">{name}</div>
      <div className="md:col-span-5">
        <div className="relative">
          {simulation?.stats && <ResultSection {...simulation.stats} />}

          {/* this part doesn't show up because of broken CSS */}
          {_.has(simulation, "stats.percentiles.5") && (
            <ToggleIcon isOpen={showAnalysis} open={toggleAnalysis} />
          )}

          {showAnalysis && _.has(simulation, "stats.percentiles.5") && (
            <AnalyticsSection {...simulation?.stats} />
          )}
        </div>
      </div>
    </div>
  );
};
