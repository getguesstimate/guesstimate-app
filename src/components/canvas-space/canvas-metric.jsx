import React from 'react'

import Button from 'react-bootstrap/lib/Button'
import _ from 'lodash'
import { connect } from 'react-redux';
import { removeMetric, changeMetric } from '../../actions/metric-actions.js'
import SelectedMetric from './canvas-selected-metric'

const UnSelectedMetric = React.createClass({
  getInitialState() {
    return {hover: false}
  },
  mouseOver () {
    this.setState({hover: true});
  },
  mouseOut () {
    this.setState({hover: false});
  },
  mouseClick () {
    //if (!this.props.isSelected) {
      //this.props.onSelect(this.props.item.position)
    //}
  },
  visibleId(){
    return ('$' + this.props.item.id.substring(0,3).toUpperCase())
  },
  render () {
    return(
      <div className='metric'
         onMouseEnter={this.mouseOver}
         onMouseDown={this.mouseDown}
         onMouseLeave={this.mouseOut}>
         <div className='row row1'>
           <div className='col-sm-12 median'>
             {this.props.item.value}
           </div>
         </div>
         <div className='row row2'>
           <div className='col-sm-12 name'>
           {this.props.canvasState == 'function' ? this.visibleId() : this.props.item.name}
           </div>
         </div>
      </div>
    )
  }
})

const Metric = React.createClass({
  handleChange(values) {
    this.props.dispatch(changeMetric(this.props.item.id, values))
  },
  handleRemove () {
    this.props.dispatch(removeMetric(this.props.item.id))
  },
  regularView() {
    return (
      <UnSelectedMetric
        item={this.props.item}
        isSelected={this.props.isSelected}
        onSelect={this.props.onSelect}
        canvasState={this.props.canvasState}
      />
    )
  },
  editView() {
    return (
      <SelectedMetric
        item={this.props.item}
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
