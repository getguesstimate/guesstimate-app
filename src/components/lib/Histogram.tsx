import _ from "lodash";
import React, { useImperativeHandle, useMemo, useRef } from "react";

import * as d3 from "d3";

import useSize from "@react-hook/size";
import { numberShow } from "~/lib/numberShower/numberShower";

function getYScale(data: d3.Bin<number, number>[], height: number) {
  return d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => d.length) as number])
    .range([height, 0]);
}

function getXScale(data: number[], width: number) {
  return d3
    .scaleLinear()
    .domain(d3.extent(data) as number[])
    .range([0, width])
    .nice();
}

// Computes the average of an array of numbers. If the array is empty, returns 1.
function avg(arr: number[]) {
  return arr.length > 0 ? arr.reduce((a, b) => a + b) / arr.length : 1;
}

// Computes (min(|a|,|b|)+100)/(max(|a|,|b|)+100). We add 100 to both numerator and denominator to ensure that small
// numbers don't disproprortionately affect results.
function shiftedRatio(a: number, b: number) {
  return (
    (Math.min(Math.abs(a), Math.abs(b)) + 100) /
    (Math.max(Math.abs(a), Math.abs(b)) + 100)
  );
}

// filterLowDensityPoints removes points that occur in only low density regions of the histogram, to ensure that only
// points robustly well sampled in the data affect the visualization of the histogram.
//
// The parameter 'cutOffRatio' controls how hight te point density must be for points to be kept; a cutOffRatio of 0
// would keep everything, a cutOffratio of 1.0 would keep nothing.
// Values that seem to have notable affects are typically > 0.95.
function filterLowDensityPoints(inputData: number[], cutOffRatio: number) {
  // We can't filter that intelligently for small sample sets, so we don't bother.
  if (inputData.length < 2000) {
    return inputData;
  }

  const bucketSize = inputData.length / 1000; // Grab data in 0.1% chunks.

  // Filter Left
  // As long as the ratio of the magnitude of their averages is less than the cutOffRatio, we keep discarding the left
  // endpoint and iterating along the array.
  let i: number = 0;
  for (i = 0; i < inputData.length; i++) {
    const left = inputData.slice(i * bucketSize, (i + 1) * bucketSize);
    const right = inputData.slice((i + 1) * bucketSize, (i + 2) * bucketSize);
    if (shiftedRatio(avg(left), avg(right)) >= cutOffRatio) {
      break;
    }
  }
  const leftIndex = i * bucketSize;

  // Filter Right, analogous to how we filter the left, but in reverse.
  for (i = 0; i < inputData.length; i++) {
    const left = inputData.slice(-(i + 2) * bucketSize, -(i + 1) * bucketSize);
    const right =
      i > 0
        ? inputData.slice(-(i + 1) * bucketSize, -i * bucketSize)
        : inputData.slice(-bucketSize);
    if (shiftedRatio(avg(left), avg(right)) >= cutOffRatio) {
      break;
    }
  }
  const rightIndex = -i * bucketSize;

  return rightIndex == 0
    ? inputData.slice(leftIndex)
    : inputData.slice(leftIndex, rightIndex);
}

export type HistogramTheme = "dark" | "normal" | "light";

type Props = {
  bins?: number;
  data: number[]; // must be sorted
  hoveredXCoord?: number;
  allowHover?: boolean;
  cutOffRatio?: number;
  showTicks?: boolean;
  theme?: HistogramTheme;
};

export const Histogram = React.forwardRef<{ xScale: any }, Props>(
  function Histogram(
    {
      bins = 50,
      cutOffRatio = 0, // By default cut off nothing
      data,
      hoveredXCoord,
      allowHover,
      showTicks,
      theme = "normal",
    },
    ref
  ) {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [width, height] = useSize(containerRef);

    const { xScale, yScale, histogramData } = useMemo(() => {
      const filteredData = filterLowDensityPoints(data, cutOffRatio);

      const xScale = getXScale(filteredData, width);
      const histogramDataFn = d3
        .bin()
        .domain(xScale.domain() as [number, number])
        .thresholds(bins);
      const histogramData = histogramDataFn(filteredData);
      const yScale = getYScale(histogramData, height);

      return { xScale, yScale, histogramData };
    }, [bins, data, cutOffRatio, width, height]);

    useImperativeHandle(ref, () => ({
      xScale,
    }));

    const barWidth = width / histogramData.length;
    if (!_.isFinite(barWidth)) {
      return null;
    }

    return (
      <div ref={containerRef} className="h-full">
        <svg className="h-full w-full">
          <g>
            {histogramData.map((d, i) => (
              <Bar
                key={i}
                data={d}
                xScale={xScale}
                yScale={yScale}
                barWidth={barWidth}
                height={height}
                theme={theme}
              />
            ))}
          </g>
          {allowHover && <Hoverbar hoveredXCoord={hoveredXCoord} />}
          {showTicks && (
            <g>
              <XAxis scale={xScale} height={height} />
            </g>
          )}
        </svg>
      </div>
    );
  }
);

const Hoverbar: React.FC<{
  hoveredXCoord: number | undefined;
}> = ({ hoveredXCoord }) => {
  return (
    <line
      x1={hoveredXCoord}
      x2={hoveredXCoord}
      y1={0}
      y2="100%"
      className="stroke-[#0e2c40]/50"
      style={{ strokeDasharray: "8, 5" }}
    />
  );
};

const Path: React.FC<{ scale: d3.ScaleLinear<number, number> }> = ({
  scale,
}) => {
  const [start, end] = scale.range();
  const d = `M0${start},6V0H${end}V6`;

  return (
    <path
      className="fill-none"
      style={{ shapeRendering: "crispEdges" }}
      d={d}
    />
  );
};

const Tick: React.FC<{
  value: number;
  scale: d3.ScaleLinear<number, number>;
}> = ({ value, scale }) => {
  const valueText = numberShow(value);
  let text: any = _.isFinite(value) && valueText;
  text = `${text.value}`;
  text += valueText.symbol ? valueText.symbol : "";
  text += valueText.power ? `e${valueText.power}` : "";
  if (text === "0.0") {
    text = "0";
  }
  return (
    <g transform={`translate(${scale(value)},0)`}>
      <text
        dy=".71em"
        y="-15"
        x="-6"
        className="fill-grey-666 text-[13px] font-semibold"
      >
        {text}
      </text>
    </g>
  );
};

const XAxis: React.FC<{
  scale: d3.ScaleLinear<number, number>;
  height: number;
}> = ({ scale, height }) => {
  const ticks = scale.ticks
    .apply(scale)
    .map((tick, i) => <Tick value={tick} scale={scale} key={i} />);

  return (
    <g transform={`translate(0,${height})`}>
      <Path scale={scale} />
      <g>{ticks}</g>
    </g>
  );
};

const Bar: React.FC<{
  data: d3.Bin<number, number>;
  xScale: d3.ScaleLinear<number, number>;
  yScale: d3.ScaleLinear<number, number>;
  barWidth: number;
  height: number;
  theme: HistogramTheme;
}> = ({ data, xScale, yScale, barWidth, height, theme }) => {
  const scaledX = xScale(data.x0!);
  const scaledY = yScale(data.length);

  const themeToColor: { [t in HistogramTheme]: string } = {
    dark: "fill-[#92a9b8]",
    normal: "fill-[#c5e0f3]",
    light: "fill-grey-a1",
  };

  return (
    <g
      className={themeToColor[theme]}
      transform={`translate(${scaledX},${scaledY})`}
    >
      <rect width={barWidth} height={height - scaledY} />
    </g>
  );
};
