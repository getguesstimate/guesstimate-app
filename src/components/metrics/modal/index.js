import React, {Component, PropTypes} from 'react'
import Modal from 'react-modal'
import DistributionSummary from '../card/simulation_summary'
import Histogram from 'gComponents/simulations/histogram'
import stats from 'stats-lite'
import EditingPane from '../card/editing_pane';
import Reasoning from './reasoning'
import './style.css'

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

  _changeReasoning(value) {
    let newGuesstimate = Object.assign({}, this.props.metric.guesstimate, {reasoning: value})
    console.log(newGuesstimate)
    this.props.onChange(newGuesstimate)
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
            <Histogram height={200} top={0} bottom={0} bins={200}
                simulation={metric.simulation}
            />
          </div>
          <div className='row'>
            <div className='col-sm-12'>
                <h1> {metric.name} </h1>
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
                      <tr><td> {e.percentage}{'%'} </td><td> {e.value} </td></tr>
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
                <EditingPane
                    guesstimate={metric.guesstimate}
                    guesstimateForm={this.props.guesstimateForm}
                    metricId={metric.id}
                    editable={false}
                    size={'large'}
                />
            </div>
          </div>
          <div className='row reasoningSection'>
            <div className='col-xs-12'>
              {guesstimate &&
                <Reasoning
                  onChange={this._changeReasoning.bind(this)}
                  value={guesstimate.reasoning}
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
