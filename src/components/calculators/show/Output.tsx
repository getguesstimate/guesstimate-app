import _ from "lodash";
import React from "react";
import { FieldHelp } from "~/components/workspace/FieldHelp";
import styles from "../calculator.module.css";

import { numberShow } from "~/lib/numberShower/numberShower";

import { FullDenormalizedMetric } from "~/lib/engine/space";

const PrecisionNumber: React.FC<{ value: number; precision?: number }> = ({
  value,
  precision,
}) => {
  const number = numberShow(value, precision);
  return (
    <span className={styles.value}>
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
  return (
    <div className={styles.output}>
      <div className={styles.outputHeading}>
        <span>{name}</span>
        {_.has(simulation, "stats.percentiles.5") && (
          <FieldHelp label={`Result details for ${name}`}>
            <AnalyticsSection {...simulation?.stats} />
          </FieldHelp>
        )}
      </div>
      {simulation?.stats ? (
        <ResultSection {...simulation.stats} />
      ) : (
        <span className={styles.hint}>No result yet</span>
      )}
    </div>
  );
};
