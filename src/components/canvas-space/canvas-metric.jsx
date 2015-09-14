import React from 'react'
import SpaceActions from '../../actions/space-actions'
import Guesstimate from './canvas-guesstimate'
import Distribution from './canvas-distribution'
import Panel from 'react-bootstrap/lib/Panel'
import Icon from'react-fa'
import Popover from 'react-bootstrap/lib/Popover'
import addons from "react/addons";
let {addons: {CSSTransitionGroup}} = addons;
let ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

import LazyInput from 'lazy-input'
import $ from 'jquery'
import Button from 'react-bootstrap/lib/Button'
import Input from 'react-bootstrap/lib/Input'
import _ from 'lodash'

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { removeMetric, changeMetric } from '../../reducers/index';
window.jquery = $

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(actionCreators, dispatch) };
}

const BasicInput = React.createClass({
  getInitialState() {
    return {
      value: this.props.value || ''
    };
  },

  handleChange() {
    this.setState({ value: this.refs.input.getValue()});
  },

  handleBlur(){
    let values = {}
    values[this.props.name] = this.state.value
    this.props.onChange(values)
  },

  handleSubmit(e) {
    if (e.keyCode === 13) {
      this.handleBlur()
    }
  },

  render() {
    return (
      <Input
        tabIndex={10}
        type='text'
        placeholder={this.props.name}
        name={this.props.name}
        value={this.state.value}
        ref='input'
        onBlur={this.handleBlur}
        onKeyDown={this.handleSubmit}
        onChange={this.handleChange} />
    );
  }
});

const TextField = React.createClass({
  render() {
    console.log(this.props.value)
    return (
     <LazyInput key={this.props.name} type="text" name={this.props.name} defaultValue="" onChange={this.props.onChange} value={this.props.value} />
    )
  }
});

const Hover = React.createClass({
  render () {
    return(
    <div className="hover" >
      <div className='triangle'></div>
      <div className='hover-internal'> Foobar </div>
    </div>
    )
  }
})

const SelectedMetric = React.createClass({
  _handleChange(values) {
    this.props.handleChange(values)
  },
  _handlePress(e) {
    if (e.target === this.getDOMNode()) {
      if (e.keyCode == '8') {
        e.preventDefault()
        this.props.onRemove()
      }
      this.props.gridKeyPress(e)
      e.stopPropagation()
    } else {
      e.stopPropagation()
    }
  },
  render () {
    return (
      <div className='metric grid-item-focus' onKeyDown={this._handlePress} tabIndex='0'>
         <div className='row row1'>
          <div className='col-sm-9 median' >
            <BasicInput name="value" value={this.props.item.value} onChange={this._handleChange}/>
          </div>
          <div className='col-sm-3'>
            <Button bsStyle='default' onClick={this.props.onRemove}> x </Button>
          </div>
         </div>
         <div className='row row2'>
           <div className='col-sm-9 name'>
              <BasicInput name="name" value={this.props.item.name} onChange={this._handleChange}/>
           </div>
         </div>
         <ReactCSSTransitionGroup transitionName="carousel" transitionAppear={true}>
           <Hover/>
         </ReactCSSTransitionGroup>
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
  mouseClick () {
    //if (!this.props.isSelected) {
      //this.props.onSelect(this.props.item.position)
    //}
  },
  render () {
    return(
      <div className='metric'
         onMouseEnter={this.mouseOver}
         onMouseLeave={this.mouseOut}>
         <div className='row row1'>
           <div className='col-sm-12 median'>
             {this.props.item.value}
           </div>
         </div>
         <div className='row row2'>
           <div className='col-sm-12 name'>
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
