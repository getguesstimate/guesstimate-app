import React, {Component, PropTypes} from 'react'
import Modal from 'react-modal'
import Histogram from 'gComponents/simulations/histogram'

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
    console.log('rendering Modal')
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
          <div className='col-sm-8'>
            <h2> Histogram </h2>
            {showSimulation &&
              <Histogram height={300} bins={100}
                  simulation={metric.simulation}
              />
            }
          </div>
          <div className='col-sm-4 sampleValues'>
            <h2> Samples </h2>
            <ul>
            {sampleValues && sampleValues.length && _.slice(sampleValues, 0, 500).map(e =>{
              return (<li> {e}</li>)
            })}
            </ul>
          </div>
          <h1> {metric.name} </h1>
          </div>
        </div>
      }
      </Modal>
    )
  }
}
