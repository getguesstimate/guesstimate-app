import React, {Component, PropTypes} from 'react'
import Histogram from 'gComponents/simulations/histogram'
import MetricName from './name'
import DistributionSummary from 'gComponents/distributions/summary/index.js'
import StatTable from 'gComponents/simulations/stat_table'
import JSONTree from 'react-json-tree'
import MetricToken from './token/index.js'

export default class MetricCardViewSection extends Component {
  showSimulation() {
    const stats = _.get(this.props, 'metric.simulation.stats')
    if (stats && _.isFinite(stats.mean) && _.isFinite(stats.stdev) && _.isFinite(stats.length)) {
      return (stats.stdev === 0 || (stats.length > 5))
    } else {
      return false
    }
  }

  _shouldShowStatistics() {
    const showSimulation = this.showSimulation()
    const shouldShowStatistics = this._shouldShowStatistics()
    const isScientific = (this.props.canvasState.metricCardView === 'scientific')
    const isAvailable = this.showSimulation() && (_.get(this.props, 'metric.simulation.stats').length > 1)
    return isScientific && isAvailable
  }
  render() {
    const {
          metricCardView,
          showSimulation,
          metric,
          isSelected,
          onChangeName,
          guesstimateForm,
          anotherFunctionSelected,
          onOpenModal
    } = this.props
    const shouldShowJsonTree = (metricCardView === 'debugging')
    const {guesstimate} = metric
    const hasGuesstimateDescription = !_.isEmpty(guesstimate.description)
    return(
        <div className={`ViewSection section ${metricCardView}`}>

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
                      onChange={this.handleChangeMetric.bind(this)}
                      jumpSection={this._focusForm.bind(this)}
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
                 onOpenModal={this.openModal.bind(this)}
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
