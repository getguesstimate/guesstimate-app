import React, {Component} from 'react'

import Icon from 'react-fa'

import Histogram from 'gComponents/simulations/histogram/index'
import MetricName from 'gComponents/metrics/card/name/index'
import {DistributionSummary} from 'gComponents/distributions/summary/index'
import StatTable from 'gComponents/simulations/stat_table/index'
import {MetricReadableId, MetricReasoningIcon, MetricSidebarToggle, MetricExportedIcon} from 'gComponents/metrics/card/token/index'
import SensitivitySection from 'gComponents/metrics/card/SensitivitySection/SensitivitySection'

import {metricIdToNodeId} from 'lib/propagation/wrapper'
import {getMessage} from 'lib/propagation/errors'

import {getClassName, allPropsPresent, replaceByMap} from 'gEngine/utils'
import {isBreak, isInfiniteLoop, hasErrors, errors, displayableError} from 'gEngine/simulation'
import * as _collections from 'gEngine/collections'

import './style.css'

// TODO(matthew): Refactor these components. E.g. it's weird that isBreak takes all errors, but you may only care about
// the one...

// We have to display this section after it disappears
// to ensure that the metric card gets selected after click.
const ErrorIcon = ({errors}) => {
  if (isBreak(errors)) { return <Icon name='unlink'/> }
  else if (isInfiniteLoop(errors)) { return <i className='ion-ios-infinite'/> }
  else { return <Icon name='warning'/> }
}

// We have to display this section after it disappears
// to ensure that the metric card gets selected after click.
const ErrorSection = ({errors, padTop, shouldShowErrorText, messageToDisplay}) => (
  <div className={getClassName('StatsSectionErrors', isBreak(errors) ? 'minor' : 'serious', padTop ? 'padTop' : null)}>
    {shouldShowErrorText && <div className={'error-message'}>{messageToDisplay}</div> }
    {!shouldShowErrorText && <ErrorIcon errors={errors} /> }
  </div>
)

export class MetricCardViewSection extends Component {
  hasContent() { return _.result(this.refs, 'name.hasContent') }
  focusName() { _.result(this.refs, 'name.focus') }

  showSimulation() {
    const stats = _.get(this.props, 'metric.simulation.stats')
    if (stats && _.isFinite(stats.mean) && _.isFinite(stats.stdev) && _.isFinite(stats.length)) {
      return (stats.stdev === 0 || (stats.length > 1))
    } else {
      return false
    }
  }

  _shouldShowStatistics() {
    const isScientific = (!!this.props.canvasState.scientificViewEnabled)
    const isAvailable = this.showSimulation() && (_.get(this.props, 'metric.simulation.stats').length > 1)
    return isScientific && isAvailable
  }

  _hasErrors() { return !this.props.isTitle && hasErrors(this.props.metric.simulation) }
  _errors() { return this._hasErrors() ? errors(this.props.metric.simulation) : []}

  renderToken() {
    const {
      canvasState: {expandedViewEnabled, metricClickMode},
      metric: {guesstimate: {description}, readableId},
      inSelectedCell,
      hovered,
      exportedAsFact,
      onToggleSidebar,
    } = this.props
    const anotherFunctionSelected = ((metricClickMode === 'FUNCTION_INPUT_SELECT') && !inSelectedCell)
    const shouldShowReadableId = !!expandedViewEnabled || anotherFunctionSelected

    if (shouldShowReadableId) {
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

  renderErrorSection() {
    const { metric: {name}, idMap, inSelectedCell, hovered } = this.props

    const shouldShowErrorSection = this._hasErrors() && !inSelectedCell 
    if (!shouldShowErrorSection) { return false }

    const errorToDisplay = displayableError(this._errors())

    const nodeIdMap = _.transform(idMap, (runningMap, value, key) => {runningMap[metricIdToNodeId(key)] = value}, {})
    const messageToDisplay = !!errorToDisplay ? replaceByMap(getMessage(errorToDisplay), nodeIdMap) : null

    return (
      <ErrorSection
        errors={this._errors()}
        messageToDisplay={messageToDisplay}
        padTop={!_.isEmpty(name) && !inSelectedCell}
        shouldShowErrorText={!!messageToDisplay && hovered}
      />
    )
  }

  render() {
    const {
      canvasState: {scientificViewEnabled, expandedViewEnabled, metricClickMode},
      metric,
      inSelectedCell,
      onChangeName,
      onToggleSidebar,
      jumpSection,
      onMouseDown,
      showSensitivitySection,
      hovered,
      isInScreenshot,
      exportedAsFact,
    } = this.props

    const {guesstimate} = metric
    const stats = _.get(metric, 'simulation.stats')
    const showSimulation = this.showSimulation()
    const shouldShowStatistics = this._shouldShowStatistics()
    const hasGuesstimateDescription = !_.isEmpty(guesstimate.description)
    const anotherFunctionSelected = ((metricClickMode === 'FUNCTION_INPUT_SELECT') && !inSelectedCell)

    const mainClassName = getClassName(
      'MetricCardViewSection',
      metricCardView,
      anotherFunctionSelected ? 'anotherFunctionSelected' : null,
      this._hasErrors() && !inSelectedCell ? 'hasErrors' : null,
    )
    return (
      <div className={mainClassName} onMouseDown={onMouseDown}>
        {(metricCardView !== 'basic') && showSimulation &&
          <Histogram
            height={!!scientificViewEnabled ? 110 : 30}
            simulation={simulation}
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

            {this.renderErrorSection()}
          </div>
        )}
      </div>
    )
  }
}
