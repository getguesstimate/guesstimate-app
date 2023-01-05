import _ from "lodash";
import React from "react";

import everpolate from "everpolate";
import { ScatterPlot } from "react-d3-components";
import { FullDenormalizedMetric } from "~/lib/engine/space";

function importance(r2) {
  if (r2 < 0.05) {
    return "low";
  } else if (r2 < 0.5) {
    return "medium";
  } else {
    return "high";
  }
}

const Plot: React.FC<any> = ({ xSamples, ySamples, size, xLabel, yLabel }) => {
  const customValues = _.zip(xSamples, ySamples).filter(
    ([x, y]) => _.isFinite(x) && _.isFinite(y)
  );
  const data = [{ customValues }];
  const valuesAccessor = (s) => s.customValues;
  const xAccessor = (e) => e[0];
  const yAccessor = (e) => e[1];

  let customProps = {};
  if (size === "SMALL") {
    customProps = {
      width: 180,
      height: 68,
      margin: { top: 5, bottom: 9, left: 5, right: 3 },
      xAxis: {
        tickArguments: [0],
        innerTickSize: 1,
        outerTickSize: 1,
        tickPadding: 1,
      },
      yAxis: {
        tickArguments: [0],
        innerTickSize: 0,
        outerTickSize: 0,
        tickPadding: 0,
      },
    };
  } else {
    customProps = {
      width: 500,
      height: 300,
      margin: { top: 10, bottom: 40, left: 60, right: 20 },
      xAxis: {
        tickArguments: [6],
        innerTickSize: 5,
        outerTickSize: 2,
        tickPadding: 3,
        label: xLabel,
      },
      yAxis: {
        tickArguments: [6],
        innerTickSize: 5,
        outerTickSize: 2,
        tickPadding: 3,
        label: yLabel,
      },
    };
  }

  return (
    <ScatterPlot
      data={data}
      x={xAccessor}
      y={yAccessor}
      values={valuesAccessor}
      {...customProps}
    />
  );
};

const RegressionStats: React.FC<{
  xSamples: any;
  ySamples: any;
  size: string;
}> = ({ xSamples, ySamples, size }) => {
  if (_.isEmpty(xSamples) || _.isEmpty(ySamples)) {
    return null;
  }

  const regression = everpolate.linearRegression(xSamples, ySamples);
  const sampleCount = xSamples && xSamples.length;

  const rSquared = regression.rSquared;
  const xIntercept =
    regression.intercept && -1 * (regression.intercept / regression.slope);
  return (
    <div className="regression">
      {size === "SMALL" && _.isFinite(rSquared) && (
        <div>
          <span className="label"> {"r²"}</span>
          <span className={`value ${importance(rSquared)}`}>
            {" "}
            {rSquared.toFixed(2)}
          </span>
        </div>
      )}
      {size !== "SMALL" && _.isFinite(rSquared) && (
        <div>
          <div>
            <span className="label">
              {" "}
              r<sup>2</sup>
            </span>
            <span className="value"> {regression.rSquared.toFixed(2)}</span>
          </div>
          <div>
            <span className="label"> slope</span>
            <span className="value"> {regression.slope.toFixed(2)}</span>
          </div>
          <div>
            <span className="label"> x intercept</span>
            <span className="value"> {xIntercept.toFixed(2)}</span>
          </div>
          <div>
            <span className="label"> y intercept</span>
            <span className="value"> {regression.intercept.toFixed(2)}</span>
          </div>
          <div>
            <span className="label"> sample count</span>
            <span className="value"> {sampleCount}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export const SensitivitySection: React.FC<{
  xMetric: FullDenormalizedMetric;
  yMetric: FullDenormalizedMetric | null;
  size?: string;
}> = ({ xMetric, yMetric, size = "SMALL" }) => {
  const sampleCount = size === "SMALL" ? 100 : 1000;

  const sampleValues = (metric: FullDenormalizedMetric | null) => {
    const values: any = _.get(metric, "simulation.sample.values");
    return values && values.slice(0, sampleCount);
  };

  const xSamples = sampleValues(xMetric);
  const ySamples = sampleValues(yMetric);

  if (!xMetric || !yMetric || !xSamples || !ySamples) {
    return null;
  }

  return (
    <div className={`SensitivitySection ${size}`}>
      <RegressionStats xSamples={xSamples} ySamples={ySamples} size={size} />
      <Plot
        xSamples={xSamples}
        ySamples={ySamples}
        size={size}
        xLabel={xMetric.name}
        yLabel={yMetric.name}
      />
    </div>
  );
};
