'use strict';

import React, {Component, PropTypes} from 'react'
import Grid from '../grid/grid'
import Metric from './canvas-metric'
import Input from 'react-bootstrap/lib/Input'
import _ from 'lodash'
import styles from './canvas-space.styl'

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as actionCreators from '../../reducers/index'

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(actionCreators, dispatch) };
}

function mapStateToProps(state) {
  return {
    selected: state.selection,
    items: state.metrics
  }
}

class CanvasPage extends Component{
  _handleSelect = (e) => {
    this.props.actions.changeSelect(e)
  }
  _handleAddItem = (location) => {
    this.props.actions.addMetric(location)
  }
  _handleRemoveItem = (metric) => {
    this.props.actions.removeMetric(metric)
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
module.exports = connect(mapStateToProps, mapDispatchToProps)(CanvasPage);
