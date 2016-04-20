import React, {Component, PropTypes} from 'react'
import {BarChart, ScatterPlot} from 'react-d3-components'
import './style.css'

export default class Foobar extends Component {
  static defaultProps = {
    size: 'SMALL'
  }

  render() {
    const {xMetric, yMetric} = this.props

    let sampleSize = (this.props.size === 'SMALL') ? 200 : 1500

    const xSamples = _.get(xMetric, 'simulation.sample.values')
    const ySamples = _.get(yMetric, 'simulation.sample.values')

    const data = [{
      customValues: _.zip(xSamples.slice(0,sampleSize), ySamples.slice(0,sampleSize))
    }];

    var labelAccessor = (s) => ''
    var valuesAccessor = (s) => s.customValues
    var xAccessor = (e) => e[0]
    var yAccessor = (e) => e[1]

    const tooltipScatter = (x,y) => ""
    const className=`Scatter ${this.props.size}`
    return (
      <div className={className}>
        {this.props.size === 'SMALL' &&
          <ScatterPlot
            data={data}
            width={180}
            height={68}
            margin={{top: 5, bottom: 9, left: 5, right: 3}}
            xAxis={{tickArguments: [0], innerTickSize: 1, outerTickSize: 1, tickPadding: 1}}
            yAxis={{tickArguments: [0], innerTickSize: 0, outerTickSize: 0, tickPadding: 0}}
            x={xAccessor}
            y={yAccessor}
            values={valuesAccessor}/>
        }
        {this.props.size !== 'SMALL' &&
          <ScatterPlot
            data={data}
            width={800}
            height={400}
            margin={{top: 10, bottom: 40, left: 60, right: 20}}
            xAxis={{tickArguments: [6], innerTickSize: 5, outerTickSize: 2, tickPadding: 3, label: xMetric.name}}
            yAxis={{tickArguments: [6], innerTickSize: 5, outerTickSize: 2, tickPadding: 3, label: yMetric.name}}
            x={xAccessor}
            y={yAccessor}
            values={valuesAccessor}/>
        }
      </div>
    )
  }
}

