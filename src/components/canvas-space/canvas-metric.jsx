import React from 'react'
import SpaceActions from '../../actions/space-actions'
import Guesstimate from './canvas-guesstimate'
import Distribution from './canvas-distribution'
import Panel from 'react-bootstrap/lib/Panel'
import Icon from'react-fa'

import LazyInput from 'lazy-input'
import $ from 'jquery'
import Button from 'react-bootstrap/lib/Button'
import _ from 'lodash'

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { removeMetric, changeMetric } from '../../reducers/index';

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(actionCreators, dispatch) };
}

const MetricWidget = React.createClass({
  render() {
    let footer = <Guesstimate guesstimate={this.props.metric.guesstimates[0]} metricId={this.props.metric.id}/>
    return (
    <div className="col-sm-2 metric">
      <Panel footer={footer}>
        <Distribution distribution={this.props.metric.distribution()} metricId={this.props.metric.id} metricName={this.props.metric.name}/>
      </Panel>
    </div>
    )
  }
})

const TextField = React.createClass({
  render() {
    return (
      <LazyInput key={this.props.name} type="text" name={this.props.name} defaultValue="" onChange={this.props.onChange} value={this.props.value} />
    )
  }
});

const SelectedMetric = React.createClass({
  _handleChange(evt) {
    const form_values = $(evt.target.parentElement.childNodes).filter(":input");
    let values = {};
    values[form_values[0].name] = form_values.val();
    this.props.handleChange(values)
  },
  _handlePress(e) {
    if (e.target === this.getDOMNode()) {
      if (e.keyCode == '8') {
        e.preventDefault()
        this.props.onRemove()
      }
      this.props.gridKeyPress(e)
    } else {
      e.stopPropagation()
    }
  },
  render () {
    return (
      <div className='metric grid-item-focus' onKeyDown={this._handlePress} tabIndex='0'>
         <div className='row row1'>
          <div className='col-sm-9 median' >
            <TextField name="value" value={this.props.item.value} onChange={this._handleChange}/>
          </div>
          <div className='col-sm-3'>
            <Button bsStyle='danger' onClick={this.props.onRemove}> x </Button>
          </div>
         </div>
         <div className='row row2'>
           <div className='col-sm-9 name'>
              <TextField name="name" value={this.props.item.name} onChange={this._handleChange}/>
           </div>
         </div>
      </div>
    )
  }
})

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
  render () {
    return(
      <div className='metric'
         onMouseEnter={this.mouseOver}
         onMouseLeave={this.mouseOut}>
         <div className='row row1'>
           <div className='col-sm-9 median'>
             {this.props.item.value}
           </div>
         </div>
         <div className='row row2'>
           <div className='col-sm-9 name'>
             {this.props.item.name}
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
