import React, {Component, PropTypes, addons} from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux';
import { removeMetric, changeMetric } from '../../actions/metric-actions.js';
import { changeGuesstimate } from '../../actions/guesstimate-actions.js';

import Button from 'react-bootstrap/lib/Button'
import Label from 'react-bootstrap/lib/Label'
import _ from 'lodash'

import shouldPureComponentUpdate from 'react-pure-render/function';

import MetricSelected from './metric-selected';
import MetricStatTable from './MetricStatTable';
import MetricEditingPane from './MetricEditingPane.js';

import DistributionSummary from './distribution-summary'
import SimulationHistogram from './simulation-histogram.js'

import ShowIf from '../utility/showIf';

const MetricReadableId = ({canvasState, readableId}) => (
  <div className='col-sm-2 function-id'>
    {canvasState == 'function' ? (<Label bsStyle="success">{readableId}</Label>) : ''}
  </div>
)

class Metric extends Component {
  static propTypes = {
    metric: React.PropTypes.object.isRequired,
    canvasState: React.PropTypes.oneOf([
      'selecting',
      'function',
      'estimate',
      'editing'
    ]).isRequired,
    location: React.PropTypes.shape({
      row: React.PropTypes.number,
      column: React.PropTypes.number
    }),
    gridKeyPress: React.PropTypes.func.isRequired,
    guesstimateForm: React.PropTypes.object
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
    return(
      <div>
      <div className={this.props.isSelected ? 'metric grid-item-focus' : 'metric'} onKeyDown={this._handlePress.bind(this)} tabIndex='0'>
        <SimulationHistogram simulation={this.props.metric.simulation}/>
         <div className='row'>
         <MetricStatTable stats={_.get(this.props.metric, 'simulation.stats')} showIf={_.has(this.props.metric, 'simulation.stats') && this.props.isSelected}/>
           <div className={this.props.canvasState == 'function' ? 'col-sm-8 name' : 'col-sm-12 name'}>
             {this.props.metric.name}
           </div>
           {this.props.canvasState == 'function' ? <MetricReadableId canvasState={this.props.canvasState} readableId={this.props.metric.readableId}/> : false}
         </div>
         <div className='row row1'>
           <div className='col-sm-12 mean'>
             <DistributionSummary
             simulation={this.props.metric.simulation}
             guesstimateForm={this.props.guesstimateForm}
             onChangeGuesstimate={this.handleChangeGuesstimate.bind(this)}
             />
           </div>
         </div>
      </div>
         <MetricEditingPane guesstimate={this.props.metric.guesstimate} showIf={this.props.isSelected}/>
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
