'use strict';

import React, {Component, PropTypes} from 'react'
import Grid from '../grid/grid'
import Metric from './canvas-metric'
import Input from 'react-bootstrap/lib/Input'
import _ from 'lodash'
import styles from './canvas-space.styl'

import { createStore } from 'redux'
import { connect } from 'react-redux';
import { addToDo } from '../../actions/space.js'

class CanvasPage extends Component{
  _handleSelect = (e) => {
    this.setState({selected: e})
  }
  _handleAddItem = (location) => {
    this.setState({items: [...this.state.items, {location: location}], selected: {location: location}})
  }
  _handleRemoveItem = (item) => {
    let newItems = this.state.items.filter(function(i) {
      let isSame = (i.location.column == item.location.column) && (i.location.row == item.location.row)
      return !isSame
     })
    this.setState({items: newItems})
  }
  render () {
    return (
      <div className="canvas-space">
      <Grid selected={this.props.selected} handleSelect={this._handleSelect} onAddItem={this._handleAddItem}>
            {this.props.items.map((i) => {
              return (<Metric item={i} onRemove={this._handleRemoveItem} onSelect={this._handleSelect} key={JSON.stringify(i)}/>)
              })
            }
        </Grid>
      </div>
    );
  }
}

// Which action creators does it want to receive by props?
function mapDispatchToProps(dispatch) {
  return {
    addTodo: () => dispatch(addTodo())
  };
}

function mapStateToProps(state) {
  return {
    selected: state.selection,
    items: state.metrics
  }
}
module.exports = connect(mapStateToProps, mapDispatchToProps)(CanvasPage);
