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
      <LazyInput key={this.props.name} type="text" name={this.props.name} defaultValue="foo" onChange={this.props.onChange} value={this.props.value} />
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
      if (e.keyCode === '13') {
        console.log('enter')
      }
      else if (e.keyCode == '8') {
        e.preventDefault()
        console.log('removing')
        this.props.onRemove()
      }
      this.props.gridKeyPress(e)
    } else {
      e.stopPropagation()
    }
  },
  _foo(){
    console.log('foo')
  },
  render () {
    return (
      <div className='metric grid-item-focus' onKeyDown={this._handlePress} tabIndex='0'>
         <div className='row row1'>
          <div className='col-sm-9 median' >
            <TextField name="value" value={this.props.value} onChange={this._handleChange}/>
          </div>
          <div className='col-sm-3'>
            <Button bsStyle='danger' onClick={this.props.onRemove}> x </Button>
          </div>
         </div>
         <div className='row row2'>
           <div className='col-sm-9 name'>
              <TextField name="name" value={this.props.name} onChange={this._handleChange}/>
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
  mouseClick () {
    if (!this.props.isSelected) {
      this.props.onSelect(this.props.item.position)
    }
  },
  render () {
    return(
      <div className='metric'
         onMouseDown={this.mouseClick}
         onMouseEnter={this.mouseOver}
         onMouseLeave={this.mouseOut}>
         <div className='row row1'>
           <div className='col-sm-9 median'>
             {this.props.value}
           </div>
         </div>
         <div className='row row2'>
           <div className='col-sm-9 name'>
             {this.props.name}
           </div>
         </div>
      </div>
    )
  }
})

const Metric = React.createClass({
  getInitialState() {
    return { name: 'foobar', value: '800,000'}
  },
  handleChange(values) {
    this.setState(values)
  },
  onRemove () {
    this.props.onRemove(this.props.item)
  },
  regularView() {
    return (
      <UnSelectedMetric
        name={this.state.name}
        value={this.state.value}
        item={this.props.item}
        isSelected={this.props.isSelected}
        onSelect={this.props.onSelect}
      />
    )
  },
  editView() {
    return (
      <SelectedMetric
        name={this.state.name}
        value={this.state.value}
        item={this.props.item}
        onRemove={this.onRemove}
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

module.exports = Metric;
