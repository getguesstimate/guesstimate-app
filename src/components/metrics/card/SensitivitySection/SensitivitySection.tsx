import _ from "lodash";
import React, { PropsWithChildren } from "react";

import clsx from "clsx";
import everpolate from "everpolate";
import { ScatterPlot } from "react-d3-components";
import { FullDenormalizedMetric } from "~/lib/engine/space";
import { SampleValue } from "~/lib/guesstimator/samplers/Simulator";

function importance(r2: number) {
  if (r2 < 0.05) {
    return "low";
  } else if (r2 < 0.5) {
    return "medium";
  } else {
    return "high";
  }
}

const Plot: React.FC<{
  xSamples: SampleValue[];
  ySamples: SampleValue[];
  size: string;
  xLabel?: string;
  yLabel?: string;
}> = ({ xSamples, ySamples, size, xLabel, yLabel }) => {
  const customValues = _.zip(xSamples, ySamples).filter(
    (pair): pair is [number, number] =>
      _.isFinite(pair[0]) && _.isFinite(pair[1])
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

const RegressionLabel: React.FC<PropsWithChildren> = ({ children }) => (
  <span className="text-[#6f9a6f]">{children}</span>
);

const RegressionStats: React.FC<{
  xSamples: SampleValue[];
  ySamples: SampleValue[];
  size: string;
}> = ({ xSamples, ySamples, size }) => {
  if (_.isEmpty(xSamples) || _.isEmpty(ySamples)) {
    return null;
  }

  const regression = everpolate.linearRegression(xSamples, ySamples);
  const sampleCount = xSamples && xSamples.length;

  const rSquared = regression.rSquared;
  if (!_.isFinite(rSquared)) {
    return null;
  }

  const xIntercept =
    regression.intercept && -1 * (regression.intercept / regression.slope);

  const importanceClassNames = {
    low: "font-light text-[#91a791]",
    medium: "font-medium text-[#6f9a6f]",
    high: "font-bold text-[#359235]",
  } as const;

  return size === "SMALL" ? (
    <div className="absolute bottom-1 right-2">
      <span className="text-grey-666 italic text-sm">r²</span>
      <span
        className={clsx(
          "italic text-xl",
          importanceClassNames[importance(rSquared)]
        )}
      >
        {" "}
        {rSquared.toFixed(2)}
      </span>
    </div>
  ) : (
    <div className="absolute top-4 right-2 text-grey-444 text-sm">
      <div>
        <RegressionLabel>
          r<sup>2</sup>
        </RegressionLabel>
        <span> {regression.rSquared.toFixed(2)}</span>
      </div>
      <div>
        <RegressionLabel>slope</RegressionLabel>
        <span> {regression.slope.toFixed(2)}</span>
      </div>
      <div>
        <RegressionLabel>x intercept</RegressionLabel>
        <span> {xIntercept.toFixed(2)}</span>
      </div>
      <div>
        <RegressionLabel>y intercept</RegressionLabel>
        <span> {regression.intercept.toFixed(2)}</span>
      </div>
      <div>
        <RegressionLabel>sample count</RegressionLabel>
        <span> {sampleCount}</span>
      </div>
    </div>
  );
};

export const SensitivitySection: React.FC<{
  xMetric: FullDenormalizedMetric;
  yMetric: FullDenormalizedMetric | null;
  size?: "SMALL" | "LARGE";
}> = ({ xMetric, yMetric, size = "SMALL" }) => {
  const sampleCount = size === "SMALL" ? 100 : 1000;

  const sampleValues = (metric: FullDenormalizedMetric | null) => {
    const values = metric?.simulation?.sample.values;
    return values && values.slice(0, sampleCount);
  };

  const xSamples = sampleValues(xMetric);
  const ySamples = sampleValues(yMetric);

  if (!xMetric || !yMetric || !xSamples || !ySamples) {
    return null;
  }

  return (
    <div className={clsx("SensitivitySection", size)}>
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
