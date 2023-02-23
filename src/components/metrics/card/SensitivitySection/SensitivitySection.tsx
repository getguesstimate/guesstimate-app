import _ from "lodash";
import React, { PropsWithChildren, useEffect, useRef } from "react";

import * as d3 from "d3";
import clsx from "clsx";
import everpolate from "everpolate";
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
  const ref = useRef<SVGGElement>(null);

  const data = _.zip(xSamples, ySamples).filter(
    (pair): pair is [number, number] =>
      _.isFinite(pair[0]) && _.isFinite(pair[1])
  );

  const isSmall = size === "SMALL";

  const width = isSmall ? 172 : 420;
  const height = isSmall ? 54 : 250;
  const margin = isSmall
    ? { top: 5, bottom: 9, left: 5, right: 3 }
    : { top: 10, bottom: 40, left: 60, right: 20 };

  useEffect(() => {
    if (!ref.current) {
      return;
    }

    const g = d3.select(ref.current);
    g.selectAll("*").remove();

    const x = d3
      .scaleLinear()
      .domain(d3.extent(data, (d) => d[0]) as number[])
      .range([0, width]);
    const y = d3
      .scaleLinear()
      .domain(d3.extent(data, (d) => d[1]) as number[])
      .range([height, 0]);

    if (!isSmall) {
      const xAxis = g
        .append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x).ticks(6, ".9~s"));
      const yAxis = g.append("g").call(d3.axisLeft(y).ticks(6, ".9~s"));

      const styleAxis = (axis: typeof xAxis) => {
        axis
          .selectAll(".domain")
          .attr("stroke", "#e2efe9")
          .attr("stroke-width", 2);
        axis.selectAll(".tick line").attr("stroke", "#ced6dc");
        axis.selectAll(".tick text").attr("fill", "#7a909a");
      };
      styleAxis(xAxis);
      styleAxis(yAxis);

      if (xLabel) {
        g.append("text")
          .attr("text-anchor", "end")
          .attr("x", width)
          .attr("y", height - 5)
          .attr("class", "font-bold fill-[#3c4448]")
          .text(xLabel);
      }

      if (yLabel) {
        g.append("text")
          .attr("text-anchor", "end")
          .attr("transform", "rotate(-90)")
          .attr("x", 0)
          .attr("y", 15)
          .attr("class", "font-bold fill-[#3c4448]")
          .text(yLabel);
      }
    }

    g.append("g")
      .selectAll("dot")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", (d) => x(d[0]))
      .attr("cy", (d) => y(d[1]))
      .attr("r", 4.5)
      .style(
        "fill",
        isSmall ? "rgba(88, 173, 109, 0.18)" : "rgba(88, 173, 109, 0.12)"
      );
  }, [ref.current, data]);

  return (
    <svg
      width={width + margin.left + margin.right}
      height={height + margin.top + margin.bottom}
    >
      <g transform={`translate(${margin.left},${margin.top})`} ref={ref} />
    </svg>
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
      <span className="text-sm italic text-grey-666">r²</span>
      <span
        className={clsx(
          "text-xl italic",
          importanceClassNames[importance(rSquared)]
        )}
      >
        {" "}
        {rSquared.toFixed(2)}
      </span>
    </div>
  ) : (
    <div className="absolute top-4 right-2 text-sm text-grey-444">
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
    <div
      className={clsx(
        "relative",
        size === "SMALL" && "h-[70px] bg-[rgb(189,189,189)]/[0.14] px-1"
      )}
    >
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
