import React, {Component, PropTypes} from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux';
import { removeMetric, changeMetric } from 'gModules/metrics/actions.js';
import { changeGuesstimate } from 'gModules/guesstimates/actions.js';
import _ from 'lodash'

import StatTable from '../simulations/stat_table';
import SimulationHistogram from '../simulations/histogram'

import EditingPane from './card/editing_pane';
import DistributionSummary from './card/simulation_summary'
import GuesstimateForm from './card/guesstimate_form'
import Header from './card/header'

class Metric extends Component {
  displayName: 'Metric'
  static propTypes = {
    canvasState: PropTypes.oneOf([
      'selecting',
      'function',
      'estimate',
      'editing'
    ]).isRequired,
    dispatch: PropTypes.func,
    gridKeyPress: PropTypes.func.isRequired,
    guesstimateForm: PropTypes.object,
    isSelected: PropTypes.bool,
    location: PropTypes.shape({
      row: PropTypes.number,
      column: PropTypes.number
    }),
    metric: PropTypes.object.isRequired,
  }

  _handlePress(e) {
    if (e.target === ReactDOM.findDOMNode(this)) {
      if (e.keyCode == '8') {
        e.preventDefault()
        this.handleRemoveMetric()
      }
      this.props.gridKeyPress(e)
    }
    e.stopPropagation()
  }
  handleChangeMetric(values) {
    this.props.dispatch(changeMetric(this._id(), values))
  }
  handleChangeGuesstimate(values) {
    this.props.dispatch(changeGuesstimate(this._id(), values))
  }
  handleRemoveMetric () {
    this.props.dispatch(removeMetric(this._id()))
  }
  _id(){
    return this.props.metric.id
  }
  render () {
    const {isSelected, metric, canvasState, guesstimateForm} = this.props
    let anotherFunctionSelected = ((canvasState === 'function') && !isSelected)
    return(
      <div>
      <div
          className={isSelected ? 'metric grid-item-focus' : 'metric'}
          onKeyDown={this._handlePress.bind(this)}
          tabIndex='0'
      >
        <SimulationHistogram simulation={metric.simulation}/>
         <StatTable
             showIf={_.has(metric, 'simulation.stats.mean') && isSelected}
             stats={_.get(metric, 'simulation.stats')}
         />
         <Header
             anotherFunctionSelected={anotherFunctionSelected}
             metric={metric}
             onChange={this.handleChangeMetric.bind(this)}
         />
         <div className='row row1'>
           <div className='col-sm-12 mean'>
             <DistributionSummary
                 guesstimateForm={guesstimateForm}
                 simulation={metric.simulation}
             />
           </div>
         </div>
      </div>
       <EditingPane
           guesstimate={metric.guesstimate}
           guesstimateForm={guesstimateForm}
           metricId={metric.id}
           onChangeGuesstimate={this.handleChangeGuesstimate.bind(this)}
           showIf={isSelected}
       />
      </div>
    )
  }
}

function select(state) {
  return {
    guesstimateForm: state.guesstimateForm
  }
}

module.exports = connect(select)(Metric);
