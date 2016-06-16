import React, {Component} from 'react'

import Modal from 'react-modal'

import {DistributionSummary} from 'gComponents/distributions/summary/index'
import DistributionEditor from 'gComponents/distributions/editor/index'
import Histogram from 'gComponents/simulations/histogram/index'
import GuesstimateDescription from './description'
import {ButtonClose} from 'gComponents/utility/buttons/close'

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
export default class MetricModal extends Component {
  showSimulation() {
    const stats = _.get(this.props, 'metric.simulation.stats')
    if (stats && _.isFinite(stats.mean) && _.isFinite(stats.stdev) && _.isFinite(stats.length)) {
      return (stats.stdev === 0 || (stats.length > 5))
    } else {
      return false
    }
  }

  _changeGuesstimateDescription(value) {
    let newGuesstimate = Object.assign({}, this.props.metric.guesstimate, {description: value})
    this.props.onChange(newGuesstimate)
  }

  render() {
    const customStyles = {
      overlay: {
        backgroundColor: 'rgba(55, 68, 76, 0.4)'
      },
      content : {
        top                   : '10%',
        left                  : '10%',
        width                 : '80%',
        right                 : 'auto',
        bottom                : 'auto',
        marginRight           : '-50%',
        backgroundColor      : 'rgba(0,0,0,0)',
        border: 'none',
        padding: '0',
      }
    }
    const showSimulation = this.showSimulation()

    const {closeModal, metric} = this.props
    const sortedSampleValues = _.get(metric, 'simulation.sample.sortedValues')
    const stats = _.get(metric, 'simulation.stats')
    const guesstimate = metric.guesstimate
    return(
      <Modal
        isOpen={true}
        onRequestClose={closeModal}
        style={customStyles}
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
                    metricId={metric.id}
                    size={'large'}
                  />
              </div>
            </div>
            <div className='row guesstimateDescriptionSection'>
              <div className='col-xs-12'>
                {guesstimate &&
                  <GuesstimateDescription
                    onChange={this._changeGuesstimateDescription.bind(this)}
                    value={guesstimate.description}
                  />
                }
              </div>
            </div>
          </div>
        </div>
      </Modal>
    )
  }
}
