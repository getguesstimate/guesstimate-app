'use strict';

import _ from 'lodash'
import React, {Component, PropTypes} from 'react'
import $ from 'jquery'

import Grid from '../grid/grid'
import Metric from './metric'
import styles from './canvas-space.styl'

import { connect } from 'react-redux';
import { addMetric } from 'gModules/metrics/actions'
import { changeSelect } from 'gModules/selection/actions'
import { runSimulations } from 'gModules/simulations/actions'
import * as spaceActions  from 'gModules/spaces/actions';
import { canvasStateSelector } from '../../selectors/canvas-state-selector';
import e from '../../lib/engine/engine'

function mapStateToProps(state) {
  return {
    selected: state.selection,
    metrics: state.metrics,
    guesstimates: state.guesstimates,
    simulations: state.simulations,
    spaces: state.spaces
  }
}

@connect(mapStateToProps)
@connect(canvasStateSelector)
export default class CanvasSpace extends Component{
  static propTypes = {
    canvasState: PropTypes.oneOf([
      'selecting',
      'function',
      'estimate',
      'editing'
    ]),
    dispatch: PropTypes.func,
    guesstimateForm: PropTypes.object,
    guesstimates: PropTypes.array,
    isSelected: PropTypes.bool,
    metrics: PropTypes.array.isRequired,
    selected: PropTypes.object,
    simulations: PropTypes.array,
  }
  componentDidMount(){
    this.props.dispatch(runSimulations(null))
  }

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
  //todo: put this in grid instead
  size(){
    const lowestMetric = Math.max(...this.props.metrics.map(g => g.location.row)) + 2
    const selected = this.props.selected.row + 2
    const height = Math.max(3, lowestMetric, selected) || 3;
    return {columns: 4, rows: height}
  }
  testing() {
    this.props.dispatch(runSimulations(null))
  }
  dMetrics() {
    const {metrics, guesstimates, simulations} = this.props
    return e.graph.denormalize({metrics, guesstimates, simulations}).metrics
  }
  renderMetric(metric) {
    const {location} = metric
    return (
      <Metric
          canvasState={this.props.canvasState}
          key={metric.id}
          location={location}
          metric={metric}
      />
    )
  }
  render () {
    const size = this.size()
    const {selected} = this.props
    return (
      <div className="canvas-space">
        <div
            className='btn btn-large btn-primary'
            onClick={this.testing.bind(this)}
        >
          {'Foobar'}
        </div>
        <Grid
            handleSelect={this._handleSelect.bind(this)}
            onAddItem={this._handleAddMetric.bind(this)}
            selected={selected}
            size={size}
        >
          {this.dMetrics().map((m) => {
              return this.renderMetric(m)
          })}
        </Grid>
      </div>
    );
  }
}
