'use strict';

import React, {Component, PropTypes} from 'react'
import { connect } from 'react-redux';
import _ from 'lodash'

import Grid from 'gComponents/lib/grid/grid/'
import Metric from 'gComponents/metrics/card'

import { changeMetric, addMetric } from 'gModules/metrics/actions'
import { changeSelect } from 'gModules/selection/actions'
import { runSimulations, deleteSimulations } from 'gModules/simulations/actions'

import './canvas.styl'
import { userActionSelector } from './canvas-state-selector';
import { denormalizedSpaceSelector } from '../denormalized-space-selector.js';
import JSONTree from 'react-json-tree'

import HTML5Backend from 'react-dnd-html5-backend';
import { DragDropContext } from 'react-dnd';


function mapStateToProps(state) {
  return {
    canvasState: state.canvasState,
    selected: state.selection,
  }
}

const PT = PropTypes;
@DragDropContext(HTML5Backend)
@connect(mapStateToProps)
@connect(userActionSelector)
@connect(denormalizedSpaceSelector)
export default class CanvasSpace extends Component{
  static propTypes = {
    canvasState: PT.shape({
      metricCardView: PT.oneOf([
        'normal',
        'basic',
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

  _handleMoveMetric({prev, next}) {
    const metric = this.props.denormalizedSpace.metrics.find(f => _.isEqual(f.location, prev))
    this.props.dispatch(changeMetric({id: metric.id, location: next}))
    this.props.dispatch(changeSelect(next))
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

    const metricIdToLocation = (metricId) => metrics.find(m => m.id === metricId).location
    const edges = space.edges.map(e => {return {input: metricIdToLocation(e.input), output: metricIdToLocation(e.output)}})
    return (
      <div className="canvas-space">
        {(metricCardView === 'debugging') &&
          <JSONTree data={this.props}/>
        }
        <Grid
            edges={edges}
            handleSelect={this._handleSelect.bind(this)}
            onAddItem={this._handleAddMetric.bind(this)}
            onMoveItem={this._handleMoveMetric.bind(this)}
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
