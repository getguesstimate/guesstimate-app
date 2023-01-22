import _ from "lodash";
import React, { Component } from "react";

import d3 from "d3";

import { numberShow } from "~/lib/numberShower/numberShower";

function getYScale(data, height: number) {
  return d3.scale
    .linear()
    .domain([0, d3.max(data, (d) => d.y)])
    .range([height, 0]);
}

function getXScale(data: number[], width: number) {
  return d3.scale.linear().domain(d3.extent(data)).range([0, width]).nice();
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

// data prop must be sorted.
type Props = {
  top?: number;
  right?: number;
  bottom?: number;
  left?: number;
  cutOffRatio?: number;
  width: number;
  height: number;
  bins?: number;
  data: number[];
  onChangeXScale?(arg: any): void;
  hoveredXCoord?: number;
  allowHover?: boolean;
};

export class Histogram extends Component<Props> {
  static defaultProps = {
    top: 20,
    bottom: 0,
    bins: 40,
    left: 0,
    right: 0,
    cutOffRatio: 0, // By default cut off nothing.
  };

  state = {
    xScale: (e: number) => e,
    yScale: (e: number) => e,
    histogramData: [],
  };

  componentWillReceiveProps(nextProps: Props) {
    const { bins, data, height, cutOffRatio = 0, onChangeXScale } = nextProps;
    const width = nextProps.width + 1;

    const filtered_data = filterLowDensityPoints(data, cutOffRatio);

    const xScale = getXScale(filtered_data, width);
    const histogramDataFn = d3.layout.histogram().bins(xScale.ticks(bins));
    const histogramData: any = histogramDataFn(filtered_data);
    const yScale = getYScale(histogramData, height);

    onChangeXScale?.(xScale.invert);
    this.setState({ xScale, yScale, histogramData });
  }

  render() {
    const {
      // FIXME - copypasted from defaultProps because of typescript
      top = 20,
      right = 0,
      bottom = 0,
      left = 0,
      height,
      hoveredXCoord,
      allowHover,
    } = this.props;
    const width = this.props.width + 1;

    const { xScale, yScale, histogramData } = this.state;
    const barWidth = width / histogramData.length;
    if (!_.isFinite(width) || !_.isFinite(barWidth)) {
      return null;
    }

    return (
      <div className="react-d3-histogram">
        {top && bottom && width && height && (
          <svg width={width + left + right} height={height + top + bottom}>
            <g transform={"translate(" + left + "," + top + ")"}>
              {histogramData.map((d, i) => (
                <Bar
                  data={d}
                  xScale={xScale}
                  yScale={yScale}
                  height={height}
                  barWidth={barWidth}
                  key={i}
                />
              ))}

              {allowHover && (
                <Hoverbar height={height} hoveredXCoord={hoveredXCoord} />
              )}

              <XAxis height={height} scale={xScale} />
            </g>
          </svg>
        )}
      </div>
    );
  }
}

const Hoverbar: React.FC<{
  height: number;
  hoveredXCoord: number | undefined;
}> = ({ height, hoveredXCoord }) => {
  return (
    <line
      x1={hoveredXCoord}
      x2={hoveredXCoord}
      y1={0}
      y2={height}
      className="react-d3-histogram__hoverbar"
    />
  );
};

const Path: React.FC<{ scale: any }> = ({ scale }) => {
  const [start, end] = scale.range();
  const d = `M0${start},6V0H${end}V6`;

  return <path className="react-d3-histogram__domain" d={d} />;
};

const Tick: React.FC<{
  value: number;
  scale: any;
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
    <g
      className="react-d3-histogram__tick"
      transform={"translate(" + scale(value) + ",0)"}
    >
      <line x2="0" y2="6"></line>
      <text dy=".71em" y="-15" x="-6">
        {text}
      </text>
    </g>
  );
};

const XAxis: React.FC<{
  height: number;
  scale: any;
}> = ({ height, scale }) => {
  const ticks = scale.ticks.apply(scale).map(function (tick, i) {
    return <Tick value={tick} scale={scale} key={i} />;
  });

  return (
    <g
      className="react-d3-histogram__x-axis"
      transform={"translate(0," + height + ")"}
    >
      <Path scale={scale} />
      <g>{ticks}</g>
    </g>
  );
};

const Bar: React.FC<{
  data: any;
  xScale: any;
  yScale: any;
  height: number;
  barWidth: number;
}> = ({ data, xScale, yScale, height, barWidth }) => {
  const scaledX = xScale(data.x);
  const scaledY = yScale(data.y);

  return (
    <g
      className="react-d3-histogram__bar"
      transform={"translate(" + scaledX + "," + scaledY + ")"}
    >
      <rect width={barWidth} height={height - scaledY} />
    </g>
  );
};
