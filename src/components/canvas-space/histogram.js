var React = require("react");
var d3 = require("d3");

function getYScale(data, height) {
  return d3.scale.linear().
    domain([0, d3.max(data, (d) => d.y)]).
    range([height, 0]);
}

function getXScale(data, width) {
  return d3.scale.linear().
    domain([0, d3.max(data)]).
    range([0, width]);
}

export default class Histogram extends React.Component {
  static propTypes = {
    top: React.PropTypes.number,
    right: React.PropTypes.number,
    bottom: React.PropTypes.number,
    left: React.PropTypes.number,
    width: React.PropTypes.number.isRequired,
    height: React.PropTypes.number.isRequired,
    data: React.PropTypes.arrayOf(React.PropTypes.number).isRequired
  };

  static defaultProps = {
    top: 20,
    right: 5,
    bottom: 30,
    left: 5
  };

  render() {
    var { top, right, bottom, left, data, width, height } = this.props;

    let xScale = getXScale(data, width);
    let histogramDataFn = d3.layout.histogram().bins(xScale.ticks(80));
    let histogramData = histogramDataFn(data);
    let yScale = getYScale(histogramData, height);

    return (
      <div className="react-d3-histogram">
        <svg width={width + left + right} height={height + top + bottom}>
          <g transform={"translate(" + left + "," + top + ")"}>
            {histogramData.map((d, i) => <Bar data={d} xScale={xScale} yScale={yScale} height={height} key={i} />)}
            <XAxis height={height} scale={xScale} />
          </g>
        </svg>
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

    return (
      <g className="react-d3-histogram__tick" transform={"translate(" + scale(value) + ",0)"}>
        <line x2="0" y2="6"></line>
        <text dy=".71em" y="-10" x="0" zindexstyle={textStyle}>{value}</text>
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
    height: React.PropTypes.number.isRequired
  };

  render() {
    let { data, xScale, yScale, height } = this.props;

    let scaledX = xScale(data.x);
    let scaledY = yScale(data.y);
    let scaledDx = xScale(data.dx);

    return (
      <g className="react-d3-histogram__bar" transform={"translate(" + scaledX + "," + scaledY + ")"}>
        <rect width={scaledDx - 1} height={height - scaledY} />
      </g>
    );
  }
}
