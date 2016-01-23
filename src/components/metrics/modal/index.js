import React, {Component, PropTypes} from 'react'
import Modal from 'react-modal'
import DistributionSummary from 'gComponents/distributions/summary/index.js'
import Histogram from 'gComponents/simulations/histogram'
import DistributionEditor from 'gComponents/distributions/editor/index.js'
import GuesstimateDescription from './description'
import {ButtonClose} from 'gComponents/utility/buttons/close'
import './style.css'
import {Stats} from 'fast-stats'

export default class MetricModal extends Component {
  showSimulation() {
    const stats = _.get(this.props, 'metric.simulation.stats')
    if (stats && _.isFinite(stats.mean) && _.isFinite(stats.stdev) && _.isFinite(stats.length)) {
      return (stats.stdev === 0 || (stats.length > 5))
    } else {
      return false
    }
  }

  shouldComponentUpdate(nextProps) {
    return (nextProps.isOpen || this.props.isOpen)
  }

  percentages(values) {
    const perc = [1, 5, 50, 95, 99]
    let s1 = new Stats().push(values)
    return perc.map(e => { return {percentage: e, value: s1.percentile(e)} })
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
        right                 : 'auto',
        bottom                : 'auto',
        marginRight           : '-50%',
        backgroundColor      : 'rgba(0,0,0,0)',
        border: 'none',
        padding: '0',
      }
    };
    const showSimulation = this.showSimulation()

    const {isOpen, closeModal, metric} = this.props
    const sampleValues = _.get(metric, 'simulation.sample.values')
    const guesstimate = metric.guesstimate
    return(
      <Modal
        isOpen={isOpen}
        onRequestClose={closeModal}
        style={customStyles}
        className={'rad-modal'}
      >
      {isOpen &&
      <div className='metricModal'>
        <div className='container top'>
          <div className='histogram'>
            <Histogram height={150} top={0} bottom={0} bins={100}
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
                      guesstimateForm={this.props.guesstimateForm}
                      simulation={metric.simulation}
                  />
                }
              </div>
              <div className='col-sm-3 subsection'>
                <div className='percentiles'>
                  <h3> Percentiles </h3>
                  <table className='ui very basic collapsing celled table'>
                    <tbody>
                    {this.percentages(sampleValues).map(e => {
                      return (
                      <tr key={e.percentage}><td> {e.percentage}{'%'} </td><td> {e.value && e.value.toFixed(3)} </td></tr>
                      )
                    })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className='container bottom'>
          <div className='row editingInputSection'>
            <div className='col-sm-6'>
                <DistributionEditor
                    guesstimate={metric.guesstimate}
                    guesstimateForm={this.props.guesstimateForm}
                    metricId={metric.id}
                    editable={false}
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
      }
      </Modal>
    )
  }
}
