import React from 'react'
import Button from 'react-bootstrap/lib/Button'
import Label from 'react-bootstrap/lib/Label'
import _ from 'lodash'

import { connect } from 'react-redux';
import { removeMetric, changeMetric } from '../../actions/metric-actions.js'
import MetricSelected from './selected-metric'

const MetricUnselected = React.createClass({
  visibleId(){
    return ('$' + this.props.metric.id.substring(0,3).toUpperCase())
  },
  render () {
    return(
      <div className='metric'>
         <div className='row row1'>
           <div className='col-sm-12 median'>
             {this.props.metric.value}
           </div>
         </div>
         <div className='row row2'>
           <div className='col-sm-8 name'>
           {this.props.metric.name}
           </div>
           <div className='col-sm-2 median'>
           {this.props.metric.distribution && this.props.metric.distribution.median}
           </div>
           <div className='col-sm-2 function-id'>
             {this.props.canvasState == 'function' ? (<Label bsStyle="success">{this.visibleId()}</Label>) : ''}
           </div>
         </div>
      </div>
    )
  }
})

const Metric = React.createClass({
  handleChange(values) {
    this.props.dispatch(changeMetric(this.props.metric.id, values))
  },
  handleRemove () {
    this.props.dispatch(removeMetric(this.props.metric.id))
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
        handleChange={this.handleChange}
        gridKeyPress={this.props.gridKeyPress}
      />
    )
  },
  render () {
    let metricType = this.props.isSelected ?  this.editView() : this.regularView()
    return (metricType)
  }
})

module.exports = connect()(Metric);
