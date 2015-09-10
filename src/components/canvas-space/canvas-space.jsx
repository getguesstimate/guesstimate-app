'use strict';

import React from 'react'
import Reflux from 'reflux'
import SpaceStore from '../../stores/spacestore.js'
import Grid from '../grid/grid'
import Metric from './canvas-metric'

import Input from 'react-bootstrap/lib/Input'
import Tabs from 'react-bootstrap/lib/Tabs'
import Tab from 'react-bootstrap/lib/Tab'
import Icon from'react-fa'
import _ from 'lodash'
import styles from './canvas-space.styl'

const CanvasPage = React.createClass({
  getInitialState () {
    return { items: [{location: {column: 3, row: 3}}], selected: {column:0, row:0}}
  },
  _handleSelect (e) {
    this.setState({selected: e})
  },
  _handleAddItem (location) {
    this.setState({items: [...this.state.items, {location: location}], selected: {location: location}})
  },
  _handleRemoveItem (item) {
    let newItems = this.state.items.filter(function(i) {
      let isSame = (i.location.column == item.location.column) && (i.location.row == item.location.row)
      return !isSame
     })
    this.setState({items: newItems})
  },
  render () {
    return (
      <div className="canvas-space">
        <Grid selected={this.state.selected} handleSelect={this._handleSelect} onAddItem={this._handleAddItem}>
            {this.state.items.map((i) => {
              return (<Metric item={i} onRemove={this._handleRemoveItem} onSelect={this._handleSelect} key={JSON.stringify(i)}/>)
              })
            }
        </Grid>
      </div>
    );
  }
});

//canvas
module.exports = CanvasPage;
