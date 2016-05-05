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

class Plot extends Component {
  render() {
    const {xSamples, ySamples, size, xLabel, yLabel} = this.props
    const data = [{ customValues: _.zip(xSamples, ySamples) }];
    const valuesAccessor = (s) => s.customValues
    const xAccessor = (e) => e[0]
    const yAccessor = (e) => e[1]

    if (size === 'SMALL'){ return(
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
    )}
    else { return(
      <ScatterPlot
        data={data}
        width={500}
        height={300}
        margin={{top: 10, bottom: 40, left: 60, right: 20}}
        xAxis={{tickArguments: [6], innerTickSize: 5, outerTickSize: 2, tickPadding: 3, label: xLabel}}
        yAxis={{tickArguments: [6], innerTickSize: 5, outerTickSize: 2, tickPadding: 3, label: yLabel}}
        x={xAccessor}
        y={yAccessor}
        values={valuesAccessor}/>
    )}
  }
}

class RegressionStats extends Component {
  render() {
    const {xSamples, ySamples, size} = this.props
    const regression = !!xSamples.length ? everpolate.linearRegression(xSamples, ySamples) : false
    const sampleSize = xSamples && xSamples.length

    const rSquared = regression.rSquared
    const xIntercept = regression.intercept && (-1 * (regression.intercept / regression.slope))
    return (
      <div className='regression'>
        {size === 'SMALL' && _.isFinite(rSquared) &&
          <div>
            <span className='label'> r<sup>2</sup></span>
            <span className={`value ${importance(rSquared)}`}> {rSquared.toFixed(2)}</span>
          </div>
        }
        { size !== 'SMALL' &&
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
              <span className='label'> sample count</span>
              <span className='value'> {sampleSize}</span>
            </div>
          </div>
        }
      </div>
    )
  }
}

export default class SensitivitySection extends Component {
  static defaultProps = {
    size: 'SMALL'
  }

  render() {
    const {xMetric, yMetric, size} = this.props

    let sampleSize = (size === 'SMALL') ? 100 : 1000
    const xSamples = _.get(xMetric, 'simulation.sample.values').slice(0, sampleSize)
    const ySamples = _.get(yMetric, 'simulation.sample.values').slice(0, sampleSize)

    return (
      <div className={`SensitivitySection ${this.props.size}`}>
        <RegressionStats xSamples={xSamples} ySamples={ySamples} size={size}/>
        <Plot xSamples={xSamples} ySamples={ySamples} size={size} xLabel={xMetric.name} yLabel={yMetric.name}/>
      </div>
    )
  }
}

