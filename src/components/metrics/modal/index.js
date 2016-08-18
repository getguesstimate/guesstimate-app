import React, {Component} from 'react'

import Modal from 'react-modal'

import {DistributionSummary} from 'gComponents/distributions/summary/index'
import DistributionEditor from 'gComponents/distributions/editor/index'
import Histogram from 'gComponents/simulations/histogram/index'
import GuesstimateDescription from './description'
import {ButtonClose} from 'gComponents/utility/buttons/close'
import {GeneralModal} from 'gComponents/utility/modal/index'

import {percentile} from 'lib/dataAnalysis'

import './style.css'

const percentages = (values, perc) => {
  return perc.map(e => { return {percentage: e, value: percentile(values, values.length, e)} })
}

const PercentileTable = ({values}) => (
  <div className='percentiles'>
    <h3> Percentiles </h3>
    <table className='ui very basic collapsing celled table'>
      <tbody>
        {!_.isEmpty(values) && percentages(values, [1,5,50,95,99]).map(e => {
          return (
            <tr key={e.percentage}><td> {e.percentage}{'%'} </td><td> {e.value && e.value.toFixed(3)} </td></tr>
          )
        })}
      </tbody>
    </table>
  </div>
)

//Note: Controlled inputs don't pass through very well.  Try to keep them in child connects().
export class MetricModal extends Component {
  showSimulation() {
    const stats = _.get(this.props, 'metric.simulation.stats')
    if (stats && _.isFinite(stats.mean) && _.isFinite(stats.stdev) && _.isFinite(stats.length)) {
      return (stats.stdev === 0 || (stats.length > 5))
    } else {
      return false
    }
  }

  render() {
    const showSimulation = this.showSimulation()

    const {closeModal, metric, errors, onChangeGuesstimateDescription} = this.props
    const sortedSampleValues = _.get(metric, 'simulation.sample.sortedValues')
    const stats = _.get(metric, 'simulation.stats')
    const guesstimate = metric.guesstimate
    return(
      <GeneralModal
        onRequestClose={closeModal}
      >
        <div className='metricModal'>
          <div className='container top'>
            <div className='histogram'>
              <Histogram height={150} top={0} bottom={0} bins={100} widthPercent={80} cutOffRatio={0.98}
                  simulation={metric.simulation}
              />
            </div>
            <div className='row'>
              <div className='col-sm-10'>
                  <h1> {metric.name} </h1>
              </div>
              <div className='col-sm-2'>
                <ButtonClose onClick={closeModal}/>
              </div>
            </div>
            <div className='distributionSection'>
              <div className='row'>
                <div className='col-sm-9 mean subsection'>
                  {showSimulation &&
                    <DistributionSummary
                      length={stats.length}
                      mean={stats.mean}
                      adjustedConfidenceInterval={stats.adjustedConfidenceInterval}
                    />
                  }
                </div>
                <div className='col-sm-3 subsection'>
                  <PercentileTable values={sortedSampleValues}/>
                </div>
              </div>
            </div>
          </div>

          <div className='container bottom'>
            <div className='row editingInputSection'>
              <div className='col-sm-12'>
                <DistributionEditor
                  guesstimate={metric.guesstimate}
                  inputMetrics={metric.edges.inputMetrics}
                  metricId={metric.id}
                  size={'large'}
                />
              </div>
            </div>
            <div className='row guesstimateDescriptionSection'>
              <div className='col-xs-12'>
                {guesstimate &&
                  <GuesstimateDescription
                    onChange={onChangeGuesstimateDescription}
                    value={guesstimate.description}
                  />
                }
              </div>
            </div>
          </div>
        </div>
      </GeneralModal>
    )
  }
}
