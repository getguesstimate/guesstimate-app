var React = require("react");
var d3 = require("d3");
import numberShow from 'lib/numberShower/numberShower.js'

function getYScale(data, height) {
  return d3.scale.linear().
    domain([0, d3.max(data, (d) => d.y)]).
    range([height, 0]);
}

function getXScale(data, width) {
  return d3.scale.linear().
    domain(d3.extent(data)).
    range([0, width]).
    nice();
}

// Computes the average of an array of numbers. If the array is empty, returns 1.
function avg(arr) {
  return arr.length > 0 ? arr.reduce((a,b)=>a+b)/arr.length : 1
}

// Computes min(|a|,|b|)/max(|a|,|b|).
function fractionLT1(a,b) {
  return Math.min(Math.abs(a),Math.abs(b))/Math.max(Math.abs(a),Math.abs(b))
}

function filterData(inputData, cutOff) {
  // We can't filter that intelligently for small sample sets, so we don't bother.
  if (inputData.length < 2000) {
    return inputData
  }

  let outputData = inputData // A copy for immutability
  outputData.sort((a,b) => a-b) // Sort the data from min -> max.

  const bucketSize = outputData.length / 1000 // Grab data in 0.1% chunks.

  // Filter Left
  let left = outputData.slice(0,bucketSize)
  let right = outputData.slice(bucketSize,2*bucketSize)
  while (fractionLT1(avg(left),avg(right)) < cutOff) {
    outputData = outputData.slice(bucketSize)
    left = outputData.slice(0,bucketSize)
    right = outputData.slice(bucketSize,2*bucketSize)
  }

  // Filter Right
  left = outputData.slice(-2*bucketSize,-bucketSize)
  right = outputData.slice(-bucketSize)
  while (fractionLT1(avg(left),avg(right)) < cutOff) {
    outputData = outputData.slice(0,-bucketSize)
    left = outputData.slice(-2*bucketSize,-bucketSize)
    right = outputData.slice(-bucketSize)
  }

  return outputData
}

export default class Histogram extends React.Component {
  static propTypes = {
    top: React.PropTypes.number,
    right: React.PropTypes.number,
    bottom: React.PropTypes.number,
    left: React.PropTypes.number,
    cutOffRatio: React.PropTypes.number,
    width: React.PropTypes.number.isRequired,
    height: React.PropTypes.number.isRequired,
    data: React.PropTypes.arrayOf(React.PropTypes.number).isRequired
  };

  static defaultProps = {
    top: 20,
    right: 5,
    bottom: 30,
    left: 5,
    bins: 40,
    cutOffRatio: 0, // By default cut off nothing.
  };

  render() {
    const { top, right, bottom, left, data, width, height, cutOffRatio } = this.props;

    const filtered_data = filterData(data, cutOffRatio)

    let xScale = getXScale(filtered_data, width);
    let bins = this.props.bins
    let histogramDataFn = d3.layout.histogram().bins(xScale.ticks(bins));
    let histogramData = histogramDataFn(filtered_data);
    let yScale = getYScale(histogramData, height);
    let barWidth = width/histogramData.length;
    return (
      <div className="react-d3-histogram">
        {top && right && bottom && left && width && height &&
          <svg width={width + left + right} height={height + top + bottom}>
            <g transform={"translate(" + left + "," + top + ")"}>
              {histogramData.map((d, i) => <Bar data={d} xScale={xScale} yScale={yScale} height={height} barWidth={barWidth} key={i} />)}
              <XAxis height={height} scale={xScale} />
            </g>
          </svg>
        }
      </div>
    );
  }
}

class Path extends React.Component {
  static propTypes = {
    scale: React.PropTypes.func.isRequired
  };

  render() {
    let [start, end] = this.props.scale.range();
    let d = `M0${start},6V0H${end}V6`;

    return (
      <path className="react-d3-histogram__domain" d={d} />
    );
  }
}

class Tick extends React.Component {
  static propTypes = {
    value: React.PropTypes.number.isRequired,
    scale: React.PropTypes.func.isRequired
  };

  render() {
    let { value, scale } = this.props;
    let textStyle = { textAnchor: "middle" };

    let valueText = numberShow(value)
    let text = _.isFinite(value) && valueText
    text = `${text.value}`
    text += valueText.symbol ? valueText.symbol : ''
    text += valueText.power ? `e${valueText.power}` : ''
    if (text === '0.0') { text = '0' }
    return (
      <g className="react-d3-histogram__tick" transform={"translate(" + scale(value) + ",0)"}>
        <line x2="0" y2="6"></line>
        <text dy=".71em" y="-15" x="0" zindexstyle={textStyle}>
          {text}
        </text>
      </g>
    );
  }
}

export class XAxis extends React.Component {
  static propTypes = {
    height: React.PropTypes.number.isRequired,
    scale: React.PropTypes.func.isRequired
  };

  render() {
    let { height, scale } = this.props;

    let ticks = scale.ticks.apply(scale).map(function(tick, i) {
      return (
        <Tick value={tick} scale={scale} key={i} />
      );
    });

    return (
      <g className="react-d3-histogram__x-axis" transform={"translate(0," + height + ")"}>
        <Path scale={scale} />
        <g>{ticks}</g>
      </g>
    );
  }
}

export class Bar extends React.Component {
  static propTypes = {
    data: React.PropTypes.arrayOf(React.PropTypes.number).isRequired,
    xScale: React.PropTypes.func.isRequired,
    yScale: React.PropTypes.func.isRequired,
    height: React.PropTypes.number.isRequired,
    barWidth: React.PropTypes.number.isRequired
  };

  render() {
    let { data, xScale, yScale, height, barWidth } = this.props;

    let scaledX = xScale(data.x);
    let scaledY = yScale(data.y);

    return (
      <g className="react-d3-histogram__bar" transform={"translate(" + scaledX + "," + scaledY + ")"}>
        <rect width={barWidth} height={height - scaledY} />
      </g>
    );
  }
}
