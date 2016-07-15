import React, {Component} from 'react'

import Icon from 'react-fa'

import Histogram from 'gComponents/simulations/histogram/index'
import MetricName from 'gComponents/metrics/card/name/index'
import {DistributionSummary} from 'gComponents/distributions/summary/index'
import StatTable from 'gComponents/simulations/stat_table/index'
import {MetricToken} from 'gComponents/metrics/card/token/index'
import SensitivitySection from 'gComponents/metrics/card/SensitivitySection/SensitivitySection'

import {INFINITE_LOOP_ERROR, INPUT_ERROR} from 'lib/errors/modelErrors'

import './style.css'

const isBreak = (errors) => _.some(errors, e => e.type === INPUT_ERROR)
const isInfiniteLoop = (errors) => _.some(errors, e => e.type === INFINITE_LOOP_ERROR)

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

  _shouldShowStatistics() {
    const isScientific = (this.props.canvasState.metricCardView === 'scientific')
    const isAvailable = this.showSimulation() && (_.get(this.props, 'metric.simulation.stats').length > 1)
    return isScientific && isAvailable
  }

  _errors() {
    if (this.props.isTitle){ return [] }
    let errors = _.get(this.props.metric, 'simulation.sample.errors')
    return errors ? errors.filter(e => !!e) : []
  }

  render() {
    const {
      canvasState: {metricCardView, metricClickMode},
      metric,
      inSelectedCell,
      onChangeName,
      onOpenModal,
      jumpSection,
      onMouseDown,
      showSensitivitySection,
      hovered,
    } = this.props

    const errors = this._errors()
    const {guesstimate} = metric
    const stats = _.get(metric, 'simulation.stats')
    const showSimulation = this.showSimulation()
    const shouldShowStatistics = this._shouldShowStatistics()
    const hasGuesstimateDescription = !_.isEmpty(guesstimate.description)
    const anotherFunctionSelected = ((metricClickMode === 'FUNCTION_INPUT_SELECT') && !inSelectedCell)
    const hasErrors = (errors.length > 0)

    let className = `MetricCardViewSection ${metricCardView}`
    className += (hasErrors & !inSelectedCell) ? ' hasErrors' : ''
    className += (anotherFunctionSelected) ? ' anotherFunctionSelected' : ''
    return(
      <div className={className} onMouseDown={onMouseDown}>
        {(metricCardView !== 'basic') && showSimulation &&
          <Histogram
            height={(metricCardView === 'scientific') ? 110 : 30}
            simulation={metric.simulation}
            cutOffRatio={0.995}
          />
        }

        <div className='MetricTokenSection'>
          {(hovered || anotherFunctionSelected || hasGuesstimateDescription) &&
            <MetricToken
              readableId={metric.readableId}
              anotherFunctionSelected={anotherFunctionSelected}
              onOpenModal={onOpenModal}
              hasGuesstimateDescription={hasGuesstimateDescription}
            />
          }
        </div>

        {(!_.isEmpty(metric.name) || inSelectedCell) &&
          <div className='NameSection'>
            <MetricName
              anotherFunctionSelected={anotherFunctionSelected}
              inSelectedCell={inSelectedCell}
              name={metric.name}
              onChange={onChangeName}
              jumpSection={jumpSection}
              onEscape={this.props.onEscape}
              ref='name'
              heightHasChanged={this.props.heightHasChanged}
              onReturn={this.props.onReturn}
              onTab={this.props.onTab}
            />
          </div>
        }

        {this.props.connectDragSource(
          <div className='StatsSection'>
            {showSensitivitySection &&
              <SensitivitySection yMetric={this.props.selectedMetric} xMetric={metric}/>
            }
            {showSimulation &&
              <div className='StatsSectionBody'>
                <DistributionSummary
                  length={stats.length}
                  mean={stats.mean}
                  adjustedConfidenceInterval={stats.adjustedConfidenceInterval}
                />
              </div>
            }
            {showSimulation && shouldShowStatistics &&
              <div className='StatsSectionTable'>
                <StatTable stats={metric.simulation.stats}/>
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
        )}
      </div>
    )
  }
}
