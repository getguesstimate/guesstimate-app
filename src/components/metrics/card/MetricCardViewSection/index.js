import React, {Component} from 'react'

import Icon from 'react-fa'

import Histogram from 'gComponents/simulations/histogram/index'
import MetricName from 'gComponents/metrics/card/name/index'
import {DistributionSummary} from 'gComponents/distributions/summary/index'
import StatTable from 'gComponents/simulations/stat_table/index'
import {MetricReadableId, MetricReasoningIcon, MetricSidebarToggle, MetricExportedIcon} from 'gComponents/metrics/card/token/index'
import SensitivitySection from 'gComponents/metrics/card/SensitivitySection/SensitivitySection'
import {divWithClasses} from 'gComponents/utility/container/Container'

import {isBreak, isInfiniteLoop, displayableError} from 'gEngine/simulation'
import * as _collections from 'gEngine/collections'

import './style.css'

// TODO(matthew): Refactor these components. E.g. it's weird that isBreak takes all errors, but you may only care about
// the one...

// We have to display this section after it disappears
// to ensure that the metric card gets selected after click.
const ErrorText = ({error}) => (<div className={'error-message'}>{error.message}</div>)

// We have to display this section after it disappears
// to ensure that the metric card gets selected after click.
const ErrorIcon = ({errors}) => {
  if (isBreak(errors)) { return <Icon name='unlink'/> }
  else if (isInfiniteLoop(errors)) { return <i className='ion-ios-infinite'/> }
  else { return <Icon name='warning'/> }
}

// We have to display this section after it disappears
// to ensure that the metric card gets selected after click.
const ErrorSection = ({errors, padTop, shouldShowErrorText, errorToDisplay}) => {
  const ErrorContainer = divWithClasses('StatsSectionErrors', isBreak(errors) ? 'minor' : 'serious', padTop ? 'padTop' : null)

  if (shouldShowErrorText) { return <ErrorContainer><ErrorText error={errorToDisplay} /></ErrorContainer> }
  return <ErrorContainer><ErrorIcon errors={errors} /></ErrorContainer>
}

export class MetricCardViewSection extends Component {
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

  _errorToDisplay() { return displayableError(this._errors()) }

  renderToken() {
    const {
      canvasState: {metricClickMode},
      metric: {guesstimate: {description}, readableId},
      inSelectedCell,
      hovered,
      exportedAsFact,
      onToggleSidebar,
    } = this.props

    if ((metricClickMode === 'FUNCTION_INPUT_SELECT') && !inSelectedCell) {
      return <MetricReadableId readableId={readableId} />
    } else if (hovered) {
      return <MetricSidebarToggle onToggleSidebar={onToggleSidebar} />
    } else if (exportedAsFact) {
      return <MetricExportedIcon />
    } else if (!_.isEmpty(description)) {
      return <MetricReasoningIcon />
    } else {
      return false
    }
  }

  render() {
    const {
      canvasState: {metricCardView, metricClickMode},
      metric,
      inSelectedCell,
      onChangeName,
      onToggleSidebar,
      jumpSection,
      onMouseDown,
      showSensitivitySection,
      hovered,
      exportedAsFact,
    } = this.props

    const errors = this._errors()
    const errorToDisplay = this._errorToDisplay()
    const {guesstimate} = metric
    const stats = _.get(metric, 'simulation.stats')
    const showSimulation = this.showSimulation()
    const shouldShowStatistics = this._shouldShowStatistics()
    const hasGuesstimateDescription = !_.isEmpty(guesstimate.description)
    const anotherFunctionSelected = ((metricClickMode === 'FUNCTION_INPUT_SELECT') && !inSelectedCell)
    const hasErrors = (errors.length > 0)

    const MetricCardViewSectionDiv = divWithClasses(
      'MetricCardViewSection',
      metricCardView,
      anotherFunctionSelected ? ' anotherFunctionSelected' : null,
      hasErrors && !inSelectedCell ? ' hasErrors' : null,
    )
    return (
      <MetricCardViewSectionDiv onMouseDown={onMouseDown}>
        {(metricCardView !== 'basic') && showSimulation &&
          <Histogram
            height={(metricCardView === 'scientific') ? 110 : 30}
            simulation={metric.simulation}
            cutOffRatio={0.995}
          />
        }

        <div className='MetricTokenSection'>
          <div className='MetricToken'>
            { this.renderToken() }
          </div>
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
              <SensitivitySection yMetric={this.props.analyzedMetric} xMetric={metric}/>
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

            {hasErrors && !inSelectedCell &&
              <ErrorSection
                errors={errors}
                errorToDisplay={errorToDisplay}
                padTop={(!_.isEmpty(metric.name) && !inSelectedCell)}
                shouldShowErrorText={!!errorToDisplay && hovered}
              />
            }
          </div>
        )}
      </MetricCardViewSectionDiv>
    )
  }
}
