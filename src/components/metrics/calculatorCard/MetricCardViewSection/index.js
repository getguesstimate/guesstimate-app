import React, {Component} from 'react'

import Icon from 'react-fa'

import Histogram from 'gComponents/simulations/histogram/index'
import {DistributionSummary} from 'gComponents/distributions/summary/index'

import './style.css'

const isBreak = (errors) => {return errors[0] && (errors[0] === 'BROKEN_UPSTREAM' || errors[0] === 'BROKEN_INPUT' )}
const isInfiniteLoop = (errors) => {return errors[0] && (errors[0] === 'INFINITE_LOOP')}

// We have to display this section after it disappears
// to ensure that the metric card gets selected after click.
const ErrorSection = ({errors, padTop, hide}) => (
  <div className={`StatsSectionErrors ${isBreak(errors) ? 'minor' : 'serious'} ${padTop ? 'padTop' : ''} ${hide ? 'isHidden' : ''}`}>
    {isBreak(errors) && <Icon name='unlink'/>}
    {!isBreak(errors) && isInfiniteLoop(errors) && <i className='ion-ios-infinite'/>}
    {!isBreak(errors) && !isInfiniteLoop(errors) && <Icon name='warning'/>}
  </div>
)

export default class MetricCardViewSection extends Component {

  hasContent() {
    return _.has(this, 'refs.name') && this.refs.name.hasContent()
  }

  showSimulation() {
    const stats = _.get(this.props, 'metric.simulation.stats')
    if (stats && _.isFinite(stats.mean) && _.isFinite(stats.stdev) && _.isFinite(stats.length)) {
      return (stats.stdev === 0 || (stats.length > 1))
    } else {
      return false
    }
  }

  focusName() {
    this.refs.name && this.refs.name.focus()
  }

  _errors() {
    if (this.props.isTitle){ return [] }
    let errors = _.get(this.props.metric, 'simulation.sample.errors')
    return errors ? errors.filter(e => !!e) : []
  }

  render() {
    const { metric, jumpSection } = this.props

    const errors = this._errors()
    const {guesstimate} = metric
    const stats = _.get(metric, 'simulation.stats')
    const showSimulation = this.showSimulation()
    const hasGuesstimateDescription = !_.isEmpty(guesstimate.description)
    const hasErrors = (errors.length > 0)

    let className = 'MetricCardViewSection'
    className += (hasErrors) ? ' hasErrors' : ''
    return(
      <div className={className}>
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
              padTop={(!_.isEmpty(metric.name) && !inSelectedCell)}
              hide={inSelectedCell}
            />
          }
        </div>
      </div>
    )
  }
}
