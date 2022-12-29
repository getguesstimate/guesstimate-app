import _ from "lodash";
import { DistributionSummary } from "gComponents/distributions/summary/index";
import Histogram from "gComponents/simulations/histogram/index";
import { cutoff, percentile } from "lib/dataAnalysis";
import React, { Component } from "react";

const MARGIN_LEFT = 10;

const percentages = (values, perc) => {
  return perc.map((e) => {
    return { percentage: e, value: percentile(values, values.length, e) };
  });
};

const findPercentile = (values, value) => {
  return cutoff(values, value) / values.length;
};

const PercentileTable = ({ values }) => (
  <div className="percentiles">
    <h3> Percentiles </h3>
    <table className="ui very basic collapsing celled table">
      <tbody>
        {!_.isEmpty(values) &&
          percentages(values, [1, 5, 50, 95, 99]).map((e) => {
            return (
              <tr key={e.percentage}>
                <td>
                  {" "}
                  {e.percentage}
                  {"%"}{" "}
                </td>
                <td> {e.value && e.value.toFixed(3)} </td>
              </tr>
            );
          })}
      </tbody>
    </table>
  </div>
);

type Props = {
  simulation: any;
  stats: any;
  sortedSampleValues: any;
};

export class HistogramWithStats extends Component<Props> {
  state = {
    hoveredXCoord: 0,
    xScale: (i) => i,
    isHovering: false,
  };

  onMouseHover(event) {
    const div: any = this.refs.div;
    const bounds = div.getBoundingClientRect();
    const x = event.clientX - bounds.left - MARGIN_LEFT;
    this.setState({ hoveredXCoord: x, isHovering: true });
  }

  changeXScale(xScale) {
    this.setState({ xScale });
  }

  render() {
    const { stats, simulation, sortedSampleValues } = this.props;
    const { hoveredXCoord, isHovering } = this.state;
    let hoveredValue, hoveredPercentile;
    if (isHovering) {
      hoveredValue = this.state.xScale(hoveredXCoord);
      hoveredPercentile = findPercentile(sortedSampleValues, hoveredValue);
    }
    return (
      <div
        className="HistogramWithStats"
        ref="div"
        onMouseMove={this.onMouseHover.bind(this)}
        onMouseEnter={() => this.setState({ isHovering: true })}
        onMouseLeave={() => this.setState({ isHovering: false })}
      >
        <div className="distributionSection">
          <div className="row">
            <div className="col-sm-9 mean subsection">
              <DistributionSummary
                length={stats.length}
                mean={stats.mean}
                adjustedConfidenceInterval={stats.adjustedConfidenceInterval}
              />
              {isHovering && (
                <div className="hovered-value">
                  <h3>{hoveredValue.toFixed(2)}</h3>
                  <h4>{`${(hoveredPercentile * 100).toFixed(
                    2
                  )}th percentile`}</h4>
                </div>
              )}
            </div>
            <div className="col-sm-3 subsection">
              <PercentileTable values={sortedSampleValues} />
            </div>
          </div>
        </div>
        <div className="histogram">
          <Histogram
            height={150}
            top={0}
            bottom={0}
            bins={100}
            widthPercent={80}
            cutOffRatio={0.98}
            left={MARGIN_LEFT}
            simulation={simulation}
            allowHover={isHovering}
            hoveredXCoord={hoveredXCoord}
            onChangeXScale={this.changeXScale.bind(this)}
          />
        </div>
      </div>
    );
  }
}
