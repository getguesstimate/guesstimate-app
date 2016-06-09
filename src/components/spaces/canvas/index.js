'use strict';

import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'

import FlowGrid from 'gComponents/lib/FlowGrid/FlowGrid'
import Metric from 'gComponents/metrics/card/index'

import {denormalizedSpaceSelector} from '../denormalized-space-selector'

import {addMetric, changeMetric, removeMetrics} from 'gModules/metrics/actions'
import {changeSelect, deSelect} from 'gModules/selected_cell/actions'
import {selectRegion, deSelectRegion} from 'gModules/selected_region/actions'
import {runSimulations, deleteSimulations} from 'gModules/simulations/actions'
import * as canvasStateActions from 'gModules/canvas_state/actions'
import {undo, redo} from 'gModules/checkpoints/actions'

import {hasMetricUpdated} from 'gComponents/metrics/card/updated'
import * as canvasStateProps from 'gModules/canvas_state/prop_type'


import './style.css'

import {isLocation, isAtLocation} from 'lib/locationUtils.js'

function mapStateToProps(state) {
  return {
    copied: state.copied,
    canvasState: state.canvasState,
    selectedCell: state.selectedCell,
    selectedRegion: state.selectedRegion,
  }
}

const PT = PropTypes;
@connect(mapStateToProps)
@connect(denormalizedSpaceSelector)
export default class Canvas extends Component{
  static propTypes = {
    canvasState: PT.shape({
      edgeView: canvasStateProps.edgeView,
      metricCardView: canvasStateProps.metricCardView,
      metricClickMode: canvasStateProps.metricClickMode
    }),
    denormalizedSpace: PropTypes.object,
    dispatch: PropTypes.func,
    selectedCell: PropTypes.object,
    embed: PropTypes.bool,
    spaceId: PropTypes.oneOfType([
        React.PropTypes.string,
        React.PropTypes.number,
    ])
  }

  static defaultProps = {
    screenshot: false
  }

  componentDidMount(){
    window.recorder.recordMountEvent(this)

    const metrics = _.get(this.props.denormalizedSpace, 'metrics')
    if (!_.isEmpty(metrics) && metrics.length > 19){
      this.props.dispatch(canvasStateActions.change({edgeView: 'hidden'}))
    } else {
      this.props.dispatch(canvasStateActions.change({edgeView: 'visible'}))
    }
    this.props.dispatch(runSimulations({spaceId: this.props.denormalizedSpace.id}))

    if (this.props.screenshot) {
      this.props.dispatch(canvasStateActions.change({metricCardView: 'display'}))
    }
  }

  componentWillUpdate() { window.recorder.recordRenderStartEvent(this) }

  componentDidUpdate(prevProps) {
    window.recorder.recordRenderStopEvent(this)

    const metrics = _.get(this.props.denormalizedSpace, 'metrics')
    const oldMetrics = _.get(prevProps.denormalizedSpace, 'metrics')
    if ((oldMetrics.length === 0) && (metrics.length > 0)){
      this.props.dispatch(runSimulations({spaceId: this.props.denormalizedSpace.id}))
    }
  }

  componentWillUnmount(){
    window.recorder.recordUnmountEvent(this)
    this.props.dispatch(deleteSimulations(this.props.denormalizedSpace.metrics.map(m => m.id)))
  }

  _handleUndo() {
    this.props.dispatch(undo(this.props.denormalizedSpace.id))
  }

  _handleRedo() {
    this.props.dispatch(redo(this.props.denormalizedSpace.id))
  }

  _handleSelect(location, selectedFrom = null) {
    this.props.dispatch(changeSelect(location, selectedFrom))
    this.props.dispatch(selectRegion(location, location))
  }

  _handleMultipleSelect(corner1, corner2) {
    this.props.dispatch(selectRegion(corner1, corner2))
  }

  _handleDeSelectAll() {
    this.props.dispatch(deSelect())
    this.props.dispatch(deSelectRegion())
  }

  _handleAddMetric(location) {
    this.props.dispatch(addMetric({space: this.props.spaceId, location: location}))
  }

  _handleMoveMetric({prev, next}) {
    const destinationMetric = this.props.denormalizedSpace.metrics.find(f => f.location.row === next.row && f.location.column === next.column)
    if (!!destinationMetric) {
      return
    }
    const metric = this.props.denormalizedSpace.metrics.find(f => f.location.row === prev.row && f.location.column === prev.column)
    this.props.dispatch(changeMetric({id: metric.id, location: next}))
    this.props.dispatch(changeSelect(next))
  }

  _selectedMetric() {
   const {selectedCell} = this.props
   const metrics = _.get(this.props.denormalizedSpace, 'metrics')

   return metrics && isLocation(selectedCell) && metrics.find(m => isAtLocation(m.location, selectedCell));
  }

  _isAnalysisView(props = this.props) {
    return (_.get(props, 'canvasState.metricCardView') === 'analysis')
  }

  renderMetric(metric, selected) {
    const {location} = metric
    const hasSelected = selected && metric && (selected.id !== metric.id)
    const selectedSamples = _.get(selected, 'simulation.sample.values')
    const passSelected = hasSelected && selectedSamples && !_.isEmpty(selectedSamples)
    return (
      <Metric
          canvasState={this.props.canvasState}
          key={metric.id}
          location={location}
          metric={metric}
          selectedMetric={passSelected && selected}
      />
    )
  }

  showEdges() {
    return (this.props.canvasState.edgeView === 'visible')
  }

  edges() {
    let edges = []

    if (this.showEdges()){
      const space = this.props.denormalizedSpace
      const {metrics} = space
      const findMetric = (metricId) => metrics.find(m => m.id === metricId)
      const metricIdToLocation = (metricId) => findMetric(metricId).location

      edges = space.edges.map(e => {
        const [inputMetric, outputMetric] = [findMetric(e.input), findMetric(e.output)]
        let errors = _.get(inputMetric, 'simulation.sample.errors')
        const color = (errors && !!errors.length) ? 'RED' : 'BLUE'
        return {input: inputMetric.location, output: outputMetric.location, color}
      })
    }
    return edges
  }

  render () {
    const {selectedCell, selectedRegion, copied} = this.props
    const {metrics} = this.props.denormalizedSpace
    const {metricCardView} = this.props.canvasState

    const edges = this.edges()
    let className = 'canvas-space'
    const showGridLines = (metricCardView !== 'display')
    this.showEdges() ? className += ' showEdges' : ''
    const selectedMetric = this._isAnalysisView() && this._selectedMetric()
    const overflow = this.props.screenshot ? 'hidden' : 'default'

    const copiedRegion = (copied && (copied.pastedTimes < 1) && copied.region) || []

    return (
      <div className={className}>
        <FlowGrid
          items={_.map(metrics, m => ({key: m.id, location: m.location, component: this.renderMetric(m, selectedMetric)}))}
          onMultipleSelect={this._handleMultipleSelect.bind(this)}
          overflow={overflow}
          hasItemUpdated = {(oldItem, newItem) => hasMetricUpdated(oldItem.props, newItem.props)}
          edges={edges}
          selectedRegion={selectedRegion}
          copiedRegion={copiedRegion}
          selectedCell={selectedCell}
          onUndo={this._handleUndo.bind(this)}
          onRedo={this._handleRedo.bind(this)}
          onSelectItem={this._handleSelect.bind(this)}
          onDeSelectAll={this._handleDeSelectAll.bind(this)}
          onAddItem={this._handleAddMetric.bind(this)}
          onMoveItem={this._handleMoveMetric.bind(this)}
          onRemoveItems={(ids) => {this.props.dispatch(removeMetrics(ids))}}
          onCopy={this.props.onCopy}
          onPaste={this.props.onPaste}
          onCut={this.props.onCut}
          showGridLines={showGridLines}
          canvasState={this.props.canvasState}
        />
      </div>
    );
  }
}
