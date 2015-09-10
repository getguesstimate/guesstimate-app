'use strict';

import React from 'react'
import Reflux from 'reflux'
import SpaceStore from '../stores/spacestore.js'
import Grid from './grid/grid'

import Input from 'react-bootstrap/lib/Input'
import Tabs from 'react-bootstrap/lib/Tabs'
import Tab from 'react-bootstrap/lib/Tab'
import Icon from'react-fa'
import LazyInput from 'lazy-input'
import Button from 'react-bootstrap/lib/Button'
import $ from 'jquery'
import _ from 'lodash'

const TextField = React.createClass({
  render() {
    return (
      <LazyInput className="form-control" key={this.props.name} type="text" name={this.props.name} defaultValue="foo" onChange={this.props.onChange} value={this.props.value} />
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
    if (e.keyCode == '13') {
      console.log('enter')
    }
    else if (e.keyCode == '8') {
      e.preventDefault()
      this.props.onRemove(this)
    }
    this.props.gridKeyPress(e)
  },
  _stopPropogation(e) {
    e.stopPropagation()
  },
  render () {
    return (
      <div className='metric grid-item-focus' tabIndex='0' onKeyDown={this._handlePress}>
        <div className='row'>
          <div className='col-sm-9' onKeyDown={this.stopPropagation}>
            <TextField name="name" value={this.props.name} onChange={this._handleChange}/>
          </div>
          <div className='col-sm-3' onKeyDown={this.stopPropagation}>
            <Button bsStyle='danger' onClick={this.props.onRemove}> x </Button>
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
      this.props.onSelect(this.props.item.position())
    }
  },
  render () {
    return(
      <div className='metric'
         onMouseDown={this.mouseClick}
         onMouseEnter={this.mouseOver}
         onMouseLeave={this.mouseOut}>
         {this.props.name}
      </div>
    )
  }
})

const Metric = React.createClass({
  getInitialState() {
    return { name: 'foobar', value: 'foooo'}
  },
  handleChange(value) {
    this.setState(values)
  },
  onRemove () {
    this.props.onRemove(this)
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
        onRemove={this.onRemove}
        onChange={this.handleChange}
        gridKeyPress={this.props.gridKeyPress}
      />
    )
  },
  render () {
    let metricType = this.props.isSelected ?  this.editView() : this.regularView()
    return (metricType)
  }
})

const CanvasPage = React.createClass({
  getInitialState () {
    return { items: [{location: {column: 3, row: 3}}], selected: {column:0, row:0}}
  },
  _handleSelect (e) {
    this.setState({selected: e})
  },
  _handleAddItem (location) {
    this.setState({items: [...this.state.items, item], selected: {location: location}})
  },
  _handleRemoveItem (location) {
    let newItems = this.state.items.filter(function(i) { return (_.isEqual(i.location, location)) })
    this.setState({items: newItems})
  },
  render () {
    return (
      <div className="row repo-component">
        <Grid selected={this.state.selected} onMove={this._handleSelect} onAddItem={this._handleAddItem}>
            {this.state.items.map((i) => {
              return (<Metric item={i} onRemove={this._handleRemoveItem} onSelect={this._handleSelect} key={i.location}/>)
              })
            }
        </Grid>
      </div>
    );
  }
});

//canvas
module.exports = CanvasPage;
