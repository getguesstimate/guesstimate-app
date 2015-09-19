import React from 'react'
import Button from 'react-bootstrap/lib/Button'
import Label from 'react-bootstrap/lib/Label'
import _ from 'lodash'

import { connect } from 'react-redux';
import { removeMetric, changeMetricName } from '../../actions/metric-actions.js';
import { changeGuesstimateInput } from '../../actions/guesstimate-actions.js';
import MetricSelected from './metric-selected';

const MetricUnselected = React.createClass({
  render () {
    return(
      <div className='metric'>
         <div className='row row1'>
           <div className='col-sm-12 median'>
             {this.props.metric.guesstimate.distribution.mean}
           </div>
         </div>
         <div className='row row2'>
           <div className='col-sm-8 name'>
           {this.props.metric.name}
           </div>
           <div className='col-sm-2 median'>
           {this.props.metric.guesstimate && this.props.metric.guesstimate.distribution.mean}
           </div>
           <div className='col-sm-2 function-id'>
             {this.props.canvasState == 'function' ? (<Label bsStyle="success">{this.props.metric.readableId}</Label>) : ''}
           </div>
         </div>
      </div>
    )
  }
})

const Metric = React.createClass({
  handleNameChange(name) {
    this.props.dispatch(changeMetricName(this._id(), name))
  },
  handleGuesstimateInputChange(input) {
    this.props.dispatch(changeGuesstimateInput(this._id(), input))
  },
  handleRemove () {
    this.props.dispatch(removeMetric(this._id()))
  },
  _id(){
    this.props.metric.id
  },
  regularView() {
    return (
      <MetricUnselected
        metric={this.props.metric}
        canvasState={this.props.canvasState}
      />
    )
  },
  editView() {
    return (
      <MetricSelected
        metric={this.props.metric}
        onRemove={this.handleRemove}
        gridKeyPress={this.props.gridKeyPress}
        onNameChange={this.handleNameChange}
        onGuesstimateInputChange={this.handleGuesstimateInputChange}
      />
    )
  },
  render () {
    let metricType = this.props.isSelected ?  this.editView() : this.regularView()
    return (metricType)
  }
})

module.exports = connect()(Metric);
