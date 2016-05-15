import React, {Component, PropTypes} from 'react'
import Histogram from 'gComponents/simulations/histogram'
import MetricName from '../name'
import DistributionSummary from 'gComponents/distributions/summary/index.js'
import StatTable from 'gComponents/simulations/stat_table'
import JSONTree from 'react-json-tree'
import MetricToken from '../token/index.js'
import './style.css'
import Icon from 'react-fa'
import SensitivitySection from '../SensitivitySection/SensitivitySection.js'

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
    const {canvasState,
          metric,
          inSelectedCell,
          onChangeName,
          guesstimateForm,
          onOpenModal,
          jumpSection,
          onMouseDown,
          showSensitivitySection
    } = this.props

    const errors = this._errors()
    const {canvasState: {metricCardView, metricClickMode}} = this.props
    const {guesstimate} = metric
    const showSimulation = this.showSimulation()
    const shouldShowStatistics = this._shouldShowStatistics()
    const shouldShowJsonTree = (metricCardView === 'debugging')
    const hasGuesstimateDescription = !_.isEmpty(guesstimate.description)
    const anotherFunctionSelected = ((metricClickMode === 'FUNCTION_INPUT_SELECT') && !inSelectedCell)
    const hasErrors = (errors.length > 0)

    return(
      <div className={`MetricCardViewSection ${metricCardView} ${(hasErrors & !inSelectedCell) ? 'hasErrors' : ''}`}
        onMouseDown={onMouseDown}
      >
        {(metricCardView !== 'basic') && showSimulation &&
          <Histogram height={(metricCardView === 'scientific') ? 110 : 30}
              simulation={metric.simulation}
              cutOffRatio={0.995}
          />
        }

        <div className='MetricTokenSection'>
          <MetricToken
           readableId={metric.readableId}
           anotherFunctionSelected={anotherFunctionSelected}
           onOpenModal={onOpenModal}
           hasGuesstimateDescription={hasGuesstimateDescription}
          />
        </div>

        {(!_.isEmpty(metric.name) || inSelectedCell) &&
          <div className='NameSection'>
              <MetricName
                inSelectedCell={inSelectedCell}
                name={metric.name}
                onChange={onChangeName}
                jumpSection={jumpSection}
                ref='name'
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
                    guesstimateForm={guesstimateForm}
                    simulation={metric.simulation}
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

        {shouldShowJsonTree &&
          <div className='row'> <div className='col-xs-12'> <JSONTree data={this.props}/> </div> </div>
        }
      </div>
    )
  }
}
