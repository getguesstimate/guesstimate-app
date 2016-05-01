import React, {Component, PropTypes} from 'react'
import {BarChart, ScatterPlot} from 'react-d3-components'
import {sampleMean, sampleStdev, percentile, cutoff, sortDescending} from 'lib/dataAnalysis.js'
import everpolate from 'everpolate'
import './style.css'

function importance(r2) {
  if (r2 < 0.05) { return 'low' }
  else if (r2 < 0.5) { return 'medium' }
  else { return 'high' }
}

export default class Foobar extends Component {
  static defaultProps = {
    size: 'SMALL'
  }

  render() {
    const {xMetric, yMetric} = this.props

    let sampleSize = (this.props.size === 'SMALL') ? 100 : 1000

    const xSamples = _.get(xMetric, 'simulation.sample.values').slice(0, sampleSize)
    const ySamples = _.get(yMetric, 'simulation.sample.values').slice(0, sampleSize)

    const data = [{
      customValues: _.zip(xSamples, ySamples)
    }];

    let regression = !!xSamples.length ? everpolate.linearRegression(xSamples, ySamples) : false

    var labelAccessor = (s) => ''
    var valuesAccessor = (s) => s.customValues
    var xAccessor = (e) => e[0]
    var yAccessor = (e) => e[1]

    const tooltipScatter = (x,y) => ""
    const className=`Scatter ${this.props.size}`

    const rSquared = regression.rSquared
    const xIntercept = regression.intercept && (-1 * (regression.intercept / regression.slope))
    return (
      <div className={className}>
        <div className='regression'>
          {this.props.size === 'SMALL' && _.isFinite(rSquared) &&
            <div>
              <span className='label'> r<sup>2</sup></span>
              <span className={`value ${importance(rSquared)}`}> {rSquared.toFixed(2)}</span>
            </div>
          }
          {this.props.size !== 'SMALL' &&
            <div>
              <div>
                <span className='label'> r<sup>2</sup></span>
                <span className='value'> {regression.rSquared.toFixed(2)}</span>
              </div>
              <div>
                <span className='label'> slope</span>
                <span className='value'> {regression.slope.toFixed(2)}</span>
              </div>
              <div>
                <span className='label'> x intercept</span>
                <span className='value'> {xIntercept.toFixed(2)}</span>
              </div>
              <div>
                <span className='label'> y intercept</span>
                <span className='value'> {regression.intercept.toFixed(2)}</span>
              </div>
              <div>
                <span className='label'> x intercept</span>
                <span className='value'> {xIntercept.toFixed(2)}</span>
              </div>
              <div>
                <span className='label'> sample count</span>
                <span className='value'> {sampleSize}</span>
              </div>
            </div>
          }
        </div>

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
            width={500}
            height={300}
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

