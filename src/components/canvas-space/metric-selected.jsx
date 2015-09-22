import React, {Component, PropTypes} from 'react';
import ReactDOM from 'react-dom'
import {connectReduxForm} from 'redux-form';
import Button from 'react-bootstrap/lib/Button'
import Input from 'react-bootstrap/lib/Input'
import GuesstimateForm from './guesstimate-form'
import DistributionSummary from './distribution-summary'
import Histogram from './histogram'
import $ from 'jquery'
import Dimensions from 'react-dimensions'

const BasicInput = React.createClass({
  getInitialState() {
    return {
      value: this.props.value || ''
    };
  },
  componentWillUnmount() {
    this._handleSubmit();
  },
  _handleChange() {
    this.setState({ value: this.refs.input.getValue()});
  },
  _handleBlur(){
    this._handleSubmit();
  },
  _handleSubmit(){
    if (this.props.value !== this.state.value){
      let values = {};
      values[this.props.name] = this.state.value;
      this.props.onChange(values);
    }
  },
  _handleKeyDown(e) {
  },
  render() {
    return (
      <Input
        tabIndex={2}
        type='text'
        placeholder={this.props.name}
        name={this.props.name}
        value={this.state.value}
        ref='input'
        onBlur={this._handleBlur}
        onKeyDown={this._handleKeyDown}
        onChange={this._handleChange} />
    );
  }
});

let MetricSelected = React.createClass({
  _handlePress(e) {
    if (e.target === ReactDOM.findDOMNode(this)) {
      if (e.keyCode == '8') {
        e.preventDefault()
        this.props.onRemoveMetric()
      }
      this.props.gridKeyPress(e)
    }
    e.stopPropagation()
  },
  render () {
    let showDistribution = !_.isEmpty(this.props.guesstimateForm) ? this.props.guesstimateForm : this.props.guesstimate
    let foo = ReactDOM.findDOMNode(this.refs.wow)
    let width = foo ? $(foo).width() : false
    let histogram = (
      <Histogram data={showDistribution.distribution.samples} width={width} height={60}/>
    )
    return (
      <div ref='wow' className='metric grid-item-focus' onKeyDown={this._handlePress} tabIndex='0'>
        {(showDistribution.distribution && showDistribution.distribution.samples && width) ? histogram : ''}
         <div className='row row2'>
           <div className='col-sm-12 name'>
            <BasicInput name="name" value={this.props.metric.name} onChange={this.props.onChangeMetric}/>
           </div>
         </div>
         <div className='row row1'>
           <div className='col-sm-12 mean'>
             <DistributionSummary distribution={showDistribution.distribution}/>
           </div>
         </div>
      </div>
    )
  }
})

export default MetricSelected
