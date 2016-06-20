import React, {Component} from 'react'

import Icon from 'react-fa'

import Histogram from 'gComponents/simulations/histogram/index'
import {DistributionSummary} from 'gComponents/distributions/summary/index'
import DistributionEditor from 'gComponents/distributions/editor/index'

import './style.css'

export class CalculatorInputCard extends Component {
  _errors() {
    let errors = _.get(this.props.metric, 'simulation.sample.errors')
    return errors ? errors.filter(e => !!e) : []
  }

  render() {
    const {metric, index} = this.props
    const errors = this._errors()

    return (
      <div className='metricCard--Container'>
        <div className={'calculatorMetricCard row'}>
          <div className='col-md-1 IndexSection'>
            <span className='CalculatorMetricIndex'> {`${index}.`} </span>
          </div>
          <div className='col-md-7 NameSection'>
            <span className='CalculatorMetricName'> {metric.name} </span>
          </div>

          <div className='col-md-4 section editing'>
            <DistributionEditor
              hideGuesstimateType={true}
              guesstimate={metric.guesstimate}
              metricId={metric.id}
              ref='DistributionEditor'
              size='small'
              errors={errors}
            />
          </div>
        </div>
      </div>
    )
  }
}
