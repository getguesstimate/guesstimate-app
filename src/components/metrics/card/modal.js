import React, {Component, PropTypes} from 'react'
import Modal from 'react-modal'
import DistributionSummary from './simulation_summary'
import Histogram from 'gComponents/simulations/histogram'
import stats from 'stats-lite'

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
    const perc = [1, 5, 10, 20, 30, 40, 50, 60, 70, 80, 90, 95, 99]
    const foo = stats
    return perc.map(e => { return {percentage: e, value: stats.percentile(values, (e/100))} })
  }

  render() {
    const customStyles = {
      overlay: {
        backgroundColor: 'rgba(55, 68, 76, 0.6)'
      },
      content : {
        top                   : '10%',
        left                  : '10%',
        right                 : 'auto',
        bottom                : 'auto',
        marginRight           : '-50%'
      }
    };
    const showSimulation = this.showSimulation()

    const {isOpen, closeModal, metric} = this.props
    const sampleValues = _.get(metric, 'simulation.sample.values')
    return(
      <Modal
        isOpen={isOpen}
        onRequestClose={closeModal}
        style={customStyles}
        className={'rad-modal'}
      >
      {isOpen &&
      <div className='container'>
        <div className='row'>
          {showSimulation &&
            <div className='col-sm-6'>
            <h2> Histogram </h2>
              <Histogram height={300} bins={100}
                  simulation={metric.simulation}
              />
            </div>
          }
          <div className='col-sm-3'>
            <h2> Percentiles </h2>
            <table className='ui very basic collapsing celled table'>
              <tbody>
              {this.percentages(sampleValues).map(e => {
                return (
                <tr><td> {e.percentage}{'%'} </td><td> {e.value} </td></tr>
                )
              })}
              </tbody>
            </table>
          </div>
          <div className='col-sm-3'>
            <h2> Samples </h2>
            <div className='sampleValues'>
              <ul>
              {sampleValues && sampleValues.length && _.slice(sampleValues, 0, 500).map(e =>{
                return (<li> {e}</li>)
              })}
              </ul>
            </div>
          </div>

          <div className='col-sm-12'>
            <h1> {metric.name} </h1>
          </div>
            <div className='col-xs-12 mean'>
              {showSimulation &&
                <DistributionSummary
                    guesstimateForm={this.props.guesstimateForm}
                    simulation={metric.simulation}
                />
              }
            </div>
          </div>
        </div>
      }
      </Modal>
    )
  }
}
