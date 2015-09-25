'use strict';

import _ from 'lodash'
import React, {Component, PropTypes} from 'react'
import $ from 'jquery'

import Grid from '../grid/grid'
import Metric from './metric'
import styles from './canvas-space.styl'

import { connect } from 'react-redux';
import { addMetric } from '../../actions/metric-actions'
import { changeSelect } from '../../actions/selection-actions'
import { runSimulations } from '../../actions/simulation-actions'
import { canvasStateSelector } from '../../selectors/canvas-state-selector';
import e from '../../lib/engine/engine'

function mapStateToProps(state) {
  return {
    selected: state.selection,
    metrics: state.metrics,
    guesstimates: state.guesstimates,
    simulations: state.simulations
  }
}

@connect(mapStateToProps)
@connect(canvasStateSelector)
export default class CanvasSpace extends Component{
  _handleSelect(event, location, item) {
    if (!_.isEqual(this.props.selected, location)){
      if ((this.props.canvasState == 'function') && item) {
        event.preventDefault()
        $(window).trigger('functionMetricClicked', item.props.metric)
      } else {
        this.props.dispatch(changeSelect(location))
      }
    }
  }
  _handleAddMetric(location) {
    this.props.dispatch(addMetric(location))
  }
  size(){
    const lowest_metric = Math.max(...this.props.metrics.map(g => g.location.row)) + 2
    const selected = this.props.selected.row + 2
    const height = Math.max(3, lowest_metric, selected) || 3;
    return {columns: 4, rows: height}
  }
  testing() {
    this.props.dispatch(runSimulations(33))
  }
  render () {
    let dMetrics = e.graph.denormalize({metrics: this.props.metrics, guesstimates: this.props.guesstimates, simulations: this.props.simulations}).metrics
    let guesstimate = (m) => { return this.props.guesstimates.filter((g) => { return g.metric === m })[0]}
    let size = this.size()
    return (
      <div className="canvas-space">
        <div className='btn btn-large btn-primary' onClick={this.testing.bind(this)}> Foobar </div>
        <Grid size={size} selected={this.props.selected} handleSelect={this._handleSelect.bind(this)} onAddItem={this._handleAddMetric.bind(this)}>
          {
            dMetrics.map((m) => {
              return (<Metric metric={m} guesstimate={guesstimate(m.id)} key={m.id} location={m.location} canvasState={this.props.canvasState}/>)
            })
          }
        </Grid>
      </div>
    );
  }
}
