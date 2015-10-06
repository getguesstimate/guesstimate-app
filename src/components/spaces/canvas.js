'use strict';

import _ from 'lodash'
import React, {Component, PropTypes} from 'react'
import $ from 'jquery'
import { connect } from 'react-redux';
import e from 'gEngine/engine'

import Grid from 'gComponents/lib/grid/grid/'
import Metric from 'gComponents/metrics/card'
import SpaceHeader from './canvas/header.js'

import { addMetric } from 'gModules/metrics/actions'
import { changeSelect } from 'gModules/selection/actions'
import { runSimulations } from 'gModules/simulations/actions'
import * as spaceActions  from 'gModules/spaces/actions';

import styles from './canvas/canvas.styl'
import { canvasStateSelector } from './canvas/canvas-state-selector';
import { denormalizedSpaceSelector } from './denormalized-space-selector.js';

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
@connect(denormalizedSpaceSelector)
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
    spaceId: PropTypes.oneOfType([
        React.PropTypes.string,
        React.PropTypes.number,
    ])
  }
  componentDidMount(){
    //this.props.dispatch(runSimulations(null))
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
    this.props.dispatch(addMetric({space: this.props.spaceId, location: location}))
  }
  //todo: put this in grid instead
  size(){
    const lowestMetric = !this.props.metrics.length ? 2 : Math.max(...this.props.metrics.map(g => parseInt(g.location.row))) + 2
    const selected = parseInt(this.props.selected.row) + 2
    const height = Math.max(3, lowestMetric, selected) || 3;
    return {columns: 4, rows: height}
  }
  handleSave() {
    this.props.dispatch(spaceActions.update(this.props.spaceId))
  }
  space() {
    return this.props.spaces.find(e => e.id === this.props.spaceId)
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
    const space = this.space()
    const {metrics} = this.props.denormalizedSpace
    return (
      <div className="canvas-space">
        <SpaceHeader space={space} onSave={this.handleSave.bind(this)}/>
        <Grid
            handleSelect={this._handleSelect.bind(this)}
            onAddItem={this._handleAddMetric.bind(this)}
            selected={selected}
            size={size}
        >
          {metrics.map((m) => {
              return this.renderMetric(m)
          })}
        </Grid>
      </div>
    );
  }
}
