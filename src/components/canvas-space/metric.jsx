import React, {Component, PropTypes, addons} from 'react'
import ReactCSSTransitionGroup from 'react/lib/ReactCSSTransitionGroup';

import Button from 'react-bootstrap/lib/Button'
import Label from 'react-bootstrap/lib/Label'
import _ from 'lodash'

import { connect } from 'react-redux';
import { removeMetric, changeMetric } from '../../actions/metric-actions.js';
import { changeGuesstimate } from '../../actions/guesstimate-actions.js';
import MetricSelected from './metric-selected';
import DistributionSummary from './distribution-summary'
import DistributionSummaryA from './distribution-summaryA'
import GuesstimateForm from './guesstimate-form';
import Histogram from './histogram'
import SimulationHistogram from './simulation-histogram.js'
import stats from 'stats-lite'
import ReactDOM from 'react-dom'
import shouldPureComponentUpdate from 'react-pure-render/function';

class Metrics extends Component{
  shouldComponentUpdate = shouldPureComponentUpdate;
  values(){
    return this.props.simulation ? this.props.simulation.sample.values : false
  };
  graph(){
    let values = this.values();
    return (
      <div>
        <table className='important-stats'>
          <tr>
            <td> mean </td>
            <td> {stats.mean(values).toFixed(2)} </td>
          </tr>
          <tr>
            <td> std </td>
            <td> {stats.stdev(values).toFixed(2)} </td>
          </tr>
          <tr>
            <td> 90th Percentile </td>
            <td> {stats.percentile(values, 0.90).toFixed(2)} </td>
          </tr>
          <tr>
            <td> Samples </td>
            <td> {values.length} </td>
          </tr>
        </table>
      </div>
    )
  }
  render(){
    return (
      <div>
      {this.values() ? this.graph() : false}
      </div>
    )
  }
}

class EditingPane extends Component {
  shouldComponentUpdate = shouldPureComponentUpdate;
  _handlePress(e) {
    e.stopPropagation()
  }
  render() {
    return (
      <ReactCSSTransitionGroup transitionEnterTimeout={500} transitionName='carousel' transitionAppear={true}>
        <div className='editing-section'>
          <div className='row'>
            <div onKeyDown={this._handlePress} className='col-xs-12'>
              <GuesstimateForm value={this.props.guesstimate.input} guesstimate={this.props.guesstimate} guesstimateForm={this.props.guesstimateForm} onSubmit={this.props.onChangeGuesstimate}/>
            </div>
          </div>
          <div className='row'>
            <div className='col-xs-12'>
            </div>
          </div>
        </div>
      </ReactCSSTransitionGroup>
    )
  }
};

const Metric = React.createClass({
  _handlePress(e) {
    if (e.target === ReactDOM.findDOMNode(this)) {
      if (e.keyCode == '8') {
        e.preventDefault()
        this.handleRemoveMetric()
      }
      this.props.gridKeyPress(e)
    }
    e.stopPropagation()
  },
  handleChangeMetric(values) {
    this.props.dispatch(changeMetric(this._id(), values))
  },
  handleChangeGuesstimate(values) {
    this.props.dispatch(changeGuesstimate(this._id(), values))
  },
  handleRemoveMetric () {
    this.props.dispatch(removeMetric(this._id()))
  },
  _id(){
    return this.props.metric.id
  },
  render () {
    let tag = (
     <div className='col-sm-2 function-id'>
       {this.props.canvasState == 'function' ? (<Label bsStyle="success">{this.props.metric.readableId}</Label>) : ''}
     </div>
    )
    return(
      <div className={this.props.isSelected ? 'metric grid-item-focus' : 'metric'} onKeyDown={this._handlePress} tabIndex='0'>
         <div className='row'>
           <div className={this.props.canvasState == 'function' ? 'col-sm-8 name' : 'col-sm-12 name'}>
             {this.props.metric.name}
           </div>
           {this.props.canvasState == 'function' ? tag : ''}
         </div>
         <div className='row row1'>
           <div className='col-sm-12 mean'>
             <DistributionSummaryA simulation={this.props.metric.simulation}/>
           </div>
         </div>
      </div>
    )
  }
})

function select(state) {
  return {
    guesstimateForm: state.guesstimateForm
  }
}

module.exports = connect(select)(Metric);
