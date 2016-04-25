var React = require("react");
var d3 = require("d3")
import numberShow from 'lib/numberShower/numberShower.js'

function getYScale(data, height) {
  return d3.scale.linear().
    domain([0, d3.max(data, d => d.y)]).
    range([height, 0])
}

function getXScale(domain, width) {
  return d3.scale.linear().
    domain(domain).
    range([0, width]).
    nice();
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

  componentWillReceiveProps(newProps) {
    this.setState(Object.assign(this.state ? this.state : {}, {builtHistogram: false}))
  }

  componentWillUpdate(newProps, newState) {
    const {data, bins, cutOffRatio, width, height} = newProps
    if (!width || (!!this.state && this.state.builtHistogram)) {
      return
    }

    window.histogramWorker.push({samples: data, bins, cutOffRatio, width, height}, ({data}) => {
      const newState = Object.assign(this.state ? this.state : {}, JSON.parse(data))
      newState.builtHistogram = true
      for (var i = 0; i < newState.histogramData.length; i ++) {
        newState.histogramData[i].dx = newState.otherData[i].dx
        newState.histogramData[i].x = newState.otherData[i].x
        newState.histogramData[i].y = newState.otherData[i].y
      }
      this.setState(newState)
    })
  }

  shouldComponentUpdate(newProps, newState) {
    if (!newState) {
      return false
    }
    return true
  }

  render() {
    if (!this.state) {
      return <div></div>
    }

    const {top, right, bottom, left, data, width, height, cutOffRatio} = this.props
    const {domain, histogramData, barWidth} = this.state

    if (!width || !histogramData || !domain || !height || !barWidth) {
      return <div></div>
    }

    const xScale = getXScale(domain, width)
    const yScale = getYScale(histogramData, height)

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
