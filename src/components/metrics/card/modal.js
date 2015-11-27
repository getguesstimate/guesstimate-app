import React, {Component, PropTypes} from 'react'
import Modal from 'react-modal'
import DistributionSummary from './simulation_summary'
import Histogram from 'gComponents/simulations/histogram'
import stats from 'stats-lite'
import EditingPane from './editing_pane';
import './modal.css'

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
        marginRight           : '-50%',
        border: 'none',
        padding: '0',
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
      <div className='container metricModal'>
        <div className='row'>
            <div className='col-sm-12'>
                <h1> {metric.name} </h1>
            </div>
        </div>
        <div className='row distributionSection'>
          <div className='col-sm-12 island'>
          <div className='row'>
              <div className='col-sm-4 mean subsection'>
                <h3> Range </h3>
                {showSimulation &&
                  <DistributionSummary
                      guesstimateForm={this.props.guesstimateForm}
                      simulation={metric.simulation}
                  />
                }
              </div>
              <div className='col-sm-5 subsection'>
                  <h3> Histogram </h3>
                    <Histogram height={150} top={0} bottom={0} bins={100}
                        simulation={metric.simulation}
                    />
              </div>
              <div className='col-sm-3 subsection'>
                  <h3> Percentiles </h3>
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
            </div>
          </div>
        </div>
        <div className='row editingInputSection'>
          <div className='col-xs-6'>
          </div>
          <div className='col-xs-6 island'>
              <EditingPane
                  guesstimate={metric.guesstimate}
                  guesstimateForm={this.props.guesstimateForm}
                  metricId={metric.id}
                  editable={false}
                  size={'large'}
              />
          </div>
        </div>
      </div>
      }
      </Modal>
    )
  }
}
