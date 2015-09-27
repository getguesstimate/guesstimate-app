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
import GuesstimateForm from './guesstimate-form';
import Histogram from './histogram'
import SimulationHistogram from './simulation-histogram.js'
import stats from 'stats-lite'
import ReactDOM from 'react-dom'
import shouldPureComponentUpdate from 'react-pure-render/function';
import ShowIf from '../utility/showIf';

const MetricReadableId = ({canvasState, readableId}) => (
  <div className='col-sm-2 function-id'>
    {canvasState == 'function' ? (<Label bsStyle="success">{readableId}</Label>) : ''}
  </div>
)

@ShowIf
class Stats extends Component {
  render() {
    let stats = this.props.stats
    return (
      <div>
        <table className='important-stats'>
          <tr>
            <td> mean </td>
            <td> {stats.mean.toFixed(2)} </td>
          </tr>
          <tr>
            <td> std </td>
            <td> {stats.stdev.toFixed(2)} </td>
          </tr>
          <tr>
            <td> Samples </td>
            <td> {stats.length} </td>
          </tr>
        </table>
      </div>
    )
  }
}

class EditingPane extends Component {
  _handlePress(e) {
    e.stopPropagation()
  }
  render() {
    return (
      <ReactCSSTransitionGroup transitionEnterTimeout={500} transitionName='carousel' transitionAppear={true}>
        <div className='editing-section'>
          <div className='row'>
            <div onKeyDown={this._handlePress} className='col-xs-12'>
              <GuesstimateForm
              value={this.props.guesstimate.input}
              guesstimate={this.props.guesstimate}
              guesstimateForm={this.props.guesstimateForm}
              onSubmit={this.props.onChangeGuesstimate}/>
            </div>
          </div>
        </div>
      </ReactCSSTransitionGroup>
    )
  }
};

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
    gridKeyPress: React.PropTypes.func.isRequired
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
      <div className={this.props.isSelected ? 'metric grid-item-focus' : 'metric'} onKeyDown={this._handlePress.bind(this)} tabIndex='0'>
        <SimulationHistogram simulation={this.props.metric.simulation}/>
         <div className='row'>
         <Stats stats={_.get(this.props.metric, 'simulation.stats')} showIf={_.has(this.props.metric, 'simulation.stats')}/>
           <div className={this.props.canvasState == 'function' ? 'col-sm-8 name' : 'col-sm-12 name'}>
             {this.props.metric.name}
           </div>
           {this.props.canvasState == 'function' ? <MetricReadableId canvasState={this.props.canvasState} readableId={this.props.metric.readableId}/> : false}
         </div>
         <div className='row row1'>
           <div className='col-sm-12 mean'>
             <DistributionSummary simulation={this.props.metric.simulation}/>
           </div>
         </div>
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
