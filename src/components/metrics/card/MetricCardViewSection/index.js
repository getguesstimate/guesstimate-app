import React, {Component, PropTypes} from 'react'
import Histogram from 'gComponents/simulations/histogram'
import MetricName from '../name'
import DistributionSummary from 'gComponents/distributions/summary/index.js'
import StatTable from 'gComponents/simulations/stat_table'
import JSONTree from 'react-json-tree'
import MetricToken from '../token/index.js'
import './style.css'

export default class MetricCardViewSection extends Component {

  hasContent() {
    return _.has(this, 'refs.name') && this.refs.name.hasContent()
  }

  showSimulation() {
    const stats = _.get(this.props, 'metric.simulation.stats')
    if (stats && _.isFinite(stats.mean) && _.isFinite(stats.stdev) && _.isFinite(stats.length)) {
      return (stats.stdev === 0 || (stats.length > 5))
    } else {
      return false
    }
  }

  _shouldShowStatistics() {
    const isScientific = (this.props.canvasState.metricCardView === 'scientific')
    const isAvailable = this.showSimulation() && (_.get(this.props, 'metric.simulation.stats').length > 1)
    return isScientific && isAvailable
  }

  render() {
    const {canvasState,
          metric,
          isSelected,
          onChangeName,
          guesstimateForm,
          onOpenModal,
          jumpSection,
          hasErrors,
          onClick
    } = this.props

    const {canvasState: {metricCardView, metricClickMode}} = this.props

    const showSimulation = this.showSimulation()
    const shouldShowStatistics = this._shouldShowStatistics()
    const shouldShowJsonTree = (metricCardView === 'debugging')
    const {guesstimate} = metric
    const hasGuesstimateDescription = !_.isEmpty(guesstimate.description)
    const anotherFunctionSelected = ((metricClickMode === 'FUNCTION_INPUT_SELECT') && !isSelected)
    return(
      <div className={`MetricCardViewSection section ${metricCardView} ${hasErrors ? 'hasErrors' : ''}`}
          onMouseDown={onClick}
      >
          {(metricCardView !== 'basic') && showSimulation &&
            <Histogram height={(metricCardView === 'scientific') ? 110 : 30}
                simulation={metric.simulation}
                cutOffRatio={0.995}
            />
          }

          <div className='row '>
            <div className='col-xs-10 sqwish-right'>
              <div className='row'>
                {(!_.isEmpty(metric.name) || isSelected) &&
                  <div className='col-xs-12'>
                    <MetricName
                      isSelected={isSelected}
                      name={metric.name}
                      onChange={onChangeName}
                      jumpSection={jumpSection}
                      ref='name'
                    />
                  </div>
                }

                <div className='col-xs-12'>
                  {showSimulation &&
                    <DistributionSummary
                        guesstimateForm={guesstimateForm}
                        simulation={metric.simulation}
                    />
                  }
                </div>
              </div>
            </div>

            <div className='col-xs-2 sqwish-middle'>
              <MetricToken
                 readableId={metric.readableId}
                 anotherFunctionSelected={anotherFunctionSelected}
                 onOpenModal={onOpenModal}
                 hasGuesstimateDescription={hasGuesstimateDescription}
              />
            </div>
          </div>

          {shouldShowJsonTree &&
            <div className='row'> <div className='col-xs-12'> <JSONTree data={this.props}/> </div> </div>
          }

          {shouldShowStatistics &&
            <div className='row'> <div className='col-xs-12'> <StatTable stats={metric.simulation.stats}/> </div> </div>
          }
        </div>
      )
  }
}
