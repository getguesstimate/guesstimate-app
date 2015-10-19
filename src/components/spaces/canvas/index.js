'use strict';

import React, {Component, PropTypes} from 'react'
import { connect } from 'react-redux';

import Grid from 'gComponents/lib/grid/grid/'
import Metric from 'gComponents/metrics/card'

import { addMetric } from 'gModules/metrics/actions'
import { changeSelect } from 'gModules/selection/actions'
import { runSimulations, deleteSimulations } from 'gModules/simulations/actions'

import './canvas.styl'
import { userActionSelector } from './canvas-state-selector';
import { denormalizedSpaceSelector } from '../denormalized-space-selector.js';
import JSONTree from 'react-json-tree'

function mapStateToProps(state) {
  return {
    canvasState: state.canvasState,
    selected: state.selection,
  }
}

const PT = PropTypes;
@connect(mapStateToProps)
@connect(userActionSelector)
@connect(denormalizedSpaceSelector)
export default class CanvasSpace extends Component{
  static propTypes = {
    canvasState: PT.shape({
      metricCardView: PT.oneOf([
        'normal',
        'scientific',
        'debugging',
      ]).isRequired,
    }),
    denormalizedSpace: PropTypes.object,
    dispatch: PropTypes.func,
    guesstimateForm: PropTypes.object,
    isSelected: PropTypes.bool,
    selected: PropTypes.object,
    spaceId: PropTypes.oneOfType([
        React.PropTypes.string,
        React.PropTypes.number,
    ]),
    userAction: PropTypes.oneOf([
      'selecting',
      'function',
      'estimate',
      'editing'
    ]),
  }

  componentDidMount(){
    this.props.dispatch(runSimulations(this.props.denormalizedSpace.metrics))
  }

  componentWillUnmount(){
    this.props.dispatch(deleteSimulations(this.props.denormalizedSpace.metrics.map(m => m.id)))
  }

  _handleSelect(location) {
    this.props.dispatch(changeSelect(location))
  }

  _handleAddMetric(location) {
    this.props.dispatch(addMetric({space: this.props.spaceId, location: location, isNew: true}))
  }

  renderMetric(metric) {
    const {location} = metric
    return (
      <Metric
          canvasState={this.props.canvasState}
          handleSelect={this._handleSelect.bind(this)}
          key={metric.id}
          location={location}
          metric={metric}
          userAction={this.props.userAction}
      />
    )
  }

  render () {
    const {selected} = this.props
    const space = this.props.denormalizedSpace
    const {metrics} = space
    const {metricCardView} = this.props.canvasState
    return (
      <div className="canvas-space">
        {(metricCardView === 'debugging') &&
          <JSONTree data={this.props}/>
        }
        <Grid
            edges={space.edges}
            handleSelect={this._handleSelect.bind(this)}
            onAddItem={this._handleAddMetric.bind(this)}
            selected={selected}
        >
          {metrics.map((m) => {
              return this.renderMetric(m)
          })}
        </Grid>
      </div>
    );
  }
}
