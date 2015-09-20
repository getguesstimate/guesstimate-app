import React, {Component, PropTypes} from 'react'
import Button from 'react-bootstrap/lib/Button'
import Label from 'react-bootstrap/lib/Label'
import _ from 'lodash'
import ReactFitText from 'react-fittext'

import { connect } from 'react-redux';
import { removeMetric, changeMetric } from '../../actions/metric-actions.js';
import { changeGuesstimate } from '../../actions/guesstimate-actions.js';
import MetricSelected from './metric-selected';

class MetricUnselected extends Component{
  render () {
    let tag = (
     <div className='col-sm-2 function-id'>
       {this.props.canvasState == 'function' ? (<Label bsStyle="success">{this.props.metric.readableId}</Label>) : ''}
     </div>
    )
    return(
      <div className='metric'>
         <div className='row'>
           <div className={this.props.canvasState == 'function' ? 'col-sm-8' : 'col-sm-12'}>
             {this.props.metric.name}
           </div>
           {this.props.canvasState == 'function' ? tag : ''}
         </div>
         <div className='row row1'>
           <div className='col-sm-12 median'>
             {this.props.guesstimate.distribution.mean}
           </div>
         </div>
      </div>
    )
  }
}

const Metric = React.createClass({
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
  regularView() {
    return (
      <MetricUnselected
        metric={this.props.metric}
        guesstimate={this.props.guesstimate}
        canvasState={this.props.canvasState}
      />
    )
  },
  editView() {
    return (
      <MetricSelected
        metric={this.props.metric}
        guesstimate={this.props.guesstimate}
        canvasState={this.props.canvasState}
        onRemoveMetric={this.handleRemoveMetric}
        gridKeyPress={this.props.gridKeyPress}
        onChangeMetric={this.handleChangeMetric}
        onChangeGuesstimate={this.handleChangeGuesstimate}
      />
    )
  },
  render () {
    let metricType = this.props.isSelected ?  this.editView() : this.regularView()
    return (metricType)
  }
})

module.exports = connect()(Metric);
