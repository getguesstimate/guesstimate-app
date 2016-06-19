import React, {Component} from 'react'

import Icon from 'react-fa'

import Histogram from 'gComponents/simulations/histogram/index'
import {DistributionSummary} from 'gComponents/distributions/summary/index'

import './style.css'

const isBreak = (errors) => {return errors[0] && (errors[0] === 'BROKEN_UPSTREAM' || errors[0] === 'BROKEN_INPUT' )}
const isInfiniteLoop = (errors) => {return errors[0] && (errors[0] === 'INFINITE_LOOP')}

// We have to display this section after it disappears
// to ensure that the metric card gets selected after click.
// TODO(Matthew): We-ll probably want to customize this here.
const ErrorSection = ({errors, padTop}) => (
  <div className={`StatsSectionErrors ${isBreak(errors) ? 'minor' : 'serious'} ${padTop ? 'padTop' : ''}`}>
    {isBreak(errors) && <Icon name='unlink'/>}
    {!isBreak(errors) && isInfiniteLoop(errors) && <i className='ion-ios-infinite'/>}
    {!isBreak(errors) && !isInfiniteLoop(errors) && <Icon name='warning'/>}
  </div>
)

export class CalculatorOutputCard extends Component {
  displayName: 'MetricCard'

  _errors() {
    if (this.props.isTitle){ return [] }
    let errors = _.get(this.props.metric, 'simulation.sample.errors')
    return errors ? errors.filter(e => !!e) : []
  }

  _shouldShowSimulation(metric) {
    const stats = _.get(metric, 'simulation.stats')
    return (stats && _.isFinite(stats.stdev) && (stats.length > 5))
  }

  render() {
    const {metric} = this.props
    const stats = _.get(metric, 'simulation.stats')
    const errors = this._errors()
    const hasErrors = !_.isEmpty(errors)
    const showSimulation = this._shouldShowSimulation(metric)

    return (
      <div className='metricCard--Container'
        ref='dom'
        tabIndex='0'
      >
        <div className={'metricCard noedge'}>
          <div className={`MetricCardViewSection${hasErrors ? ' hasErrors' : ''}`}>
            {showSimulation &&
              <Histogram
                height={30}
                simulation={metric.simulation}
                cutOffRatio={0.995}
              />
            }

            {!_.isEmpty(metric.name) &&
              <div className='NameSection'>
                <span className={'MetricName'}> {metric.name} </span>
              </div>
            }

            <div className='StatsSection'>
              {showSimulation &&
                <div className='StatsSectionBody'>
                  <DistributionSummary
                    length={stats.length}
                    mean={stats.mean}
                    adjustedConfidenceInterval={stats.adjustedConfidenceInterval}
                  />
                </div>
              }

              {hasErrors &&
                <ErrorSection
                  errors={errors}
                  padTop={(!_.isEmpty(metric.name))}
                />
              }
            </div>
          </div>
        </div>
      </div>
    )
  }
}
