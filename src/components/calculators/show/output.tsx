import _ from "lodash";
import React, { Component } from "react";

import numberShow from "~/lib/numberShower/numberShower";

import { hasErrors } from "~/lib/engine/simulation";

const PrecisionNumber: React.FC<any> = ({
  value,
  precision,
  number = numberShow(value, precision),
}) => (
  <span className="result-value">
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

const RangeDisplay: React.FC<{ range: [unknown, unknown] }> = ({
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
  <div className="stats-summary">
    {`According to the model, this value has a 90% chance of being between `}
    <PrecisionNumber value={stats.adjustedConfidenceInterval[0]} />
    {` and `}
    <PrecisionNumber value={stats.adjustedConfidenceInterval[1]} />
    {"."}
    {` The mean value is `}
    <PrecisionNumber value={stats.mean} />
    {` and the median is `}
    <PrecisionNumber value={stats.percentiles[50]} />
    {`.`}
  </div>
);

export class Output extends Component<{ metric: any }> {
  state = {
    showAnalysis: false,
  };

  toggleAnalysis() {
    const showAnalysis = this.state.showAnalysis;
    this.setState({ showAnalysis: !showAnalysis });
  }

  render() {
    const {
      metric: { name, simulation },
    } = this.props;
    const { showAnalysis } = this.state;
    return (
      <div className="output">
        <div className="row">
          <div className="col-xs-12 col-sm-7">
            <div className="name">{name}</div>
          </div>
          <div className="col-xs-12 col-sm-5">
            <div
              className={`result-section${
                hasErrors(simulation) ? " has-errors" : ""
              }`}
            >
              {_.has(simulation, "stats") && (
                <ResultSection {...simulation.stats} />
              )}

              {!showAnalysis && _.has(simulation, "stats.percentiles.5") && (
                <div className="icon" onClick={this.toggleAnalysis.bind(this)}>
                  {" "}
                  ?{" "}
                </div>
              )}
              {showAnalysis && (
                <div className="icon" onClick={this.toggleAnalysis.bind(this)}>
                  {" "}
                  <i className={`ion-md-close`} />
                </div>
              )}

              {showAnalysis && _.has(simulation, "stats.percentiles.5") && (
                <AnalyticsSection {...simulation.stats} />
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
