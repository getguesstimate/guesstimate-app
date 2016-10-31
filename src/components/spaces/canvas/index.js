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
import {fillRegion} from 'gModules/auto_fill_region/actions'

import {orArr} from 'gEngine/utils'
import * as _collections from 'gEngine/collections'
import {hasErrors} from 'gEngine/simulation'

import {hasMetricUpdated} from 'gComponents/metrics/card/updated'
import * as canvasStateProps from 'gModules/canvas_state/prop_type'

import * as segment from 'servers/segment'

import './style.css'

import {isLocation, isAtLocation, existsAtLoc, isWithinRegion} from 'lib/locationUtils.js'

function mapStateToProps(state) {
  return {
    copied: state.copied,
    selectedCell: state.selectedCell,
    selectedRegion: state.selectedRegion,
  }
}

const PT = PropTypes;
@connect(mapStateToProps)
export default class Canvas extends Component{
  static propTypes = {
    denormalizedSpace: PropTypes.object,
    dispatch: PropTypes.func,
    selectedCell: PropTypes.object,
    embed: PropTypes.bool,
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
    this.props.dispatch(canvasStateActions.endAnalysis())
  }

  _handleUndo() {
    segment.trackUndo(true)
    this.props.dispatch(undo(this.props.denormalizedSpace.id))
  }

  _handleRedo() {
    segment.trackUndo(true)
    this.props.dispatch(redo(this.props.denormalizedSpace.id))
  }

  _handleSelect(location, selectedFrom = null) {
    this.props.dispatch(changeSelect(location, selectedFrom))
    this.props.dispatch(selectRegion(location, location))
  }

  _handleMultipleSelect(corner1, corner2) {
    if (!isAtLocation(corner1, corner2)) { segment.trackSelectedRegion() }
    this.props.dispatch(selectRegion(corner1, corner2))
  }

  _handleDeSelectAll() {
    this.props.dispatch(deSelect())
    this.props.dispatch(deSelectRegion())
  }

  _handleAddMetric(location) {
    this.props.dispatch(addMetric({space: this.props.denormalizedSpace.id, location: location}))
  }

  _handleMoveMetric({prev, next}) {
    if (_.some(this.props.denormalizedSpace.metrics, existsAtLoc(next))) { return }

    const metric = this.props.denormalizedSpace.metrics.find(existsAtLoc(prev))
    this.props.dispatch(changeMetric({id: metric.id, location: next}))
    this.props.dispatch(changeSelect(next))
  }

  _selectedMetric() {
   const {selectedCell} = this.props
   const metrics = _.get(this.props.denormalizedSpace, 'metrics')

   return metrics && isLocation(selectedCell) && metrics.find(existsAtLoc(selectedCell))
  }

  _isAnalysisView(props = this.props) {
    return (_.get(props, 'denormalizedSpace.canvasState.metricCardView') === 'analysis')
  }

  isMetricEmpty(id) {
    const metric = this.props.denormalizedSpace.metrics.find(m => m.id === id)
    const {input, data} = metric.guesstimate
    return _.isEmpty(metric.name) && _.isEmpty(input) && _.isEmpty(data)
  }

  renderMetric(metric, analyzed) {
    const {location, id} = metric
    const analyzedSamples = _.get(analyzed, 'simulation.sample.values')
    const hasAnalyzed = analyzed && metric && analyzedSamples && !_.isEmpty(analyzedSamples)

    const analyzedRegion = analyzed ? [analyzed.location, analyzed.location] : []
    const {ancestors, descendants} = this.getSelectedLineage(analyzedRegion)
    const isRelatedToAnalyzed = _.some([...ancestors, ...descendants], relative => relative.id === metric.id)

    const passAnalyzed = hasAnalyzed && isRelatedToAnalyzed

    const is_private = _.get(this, 'props.denormalizedSpace.is_private')
    const organizationId = _.get(this, 'props.denormalizedSpace.organization_id')
    const canUseOrganizationFacts = !!_.get(this, 'props.canUseOrganizationFacts')

    const existingReadableIds = _.get(this, 'props.denormalizedSpace.metrics').map(m => m.readableId)
    const idMap = _.transform(orArr(_.get(this, 'props.denormalizedSpace.metrics')), (res, curr) => { res[curr.id] = curr.readableId }, {})

    const exportedAsFact = _collections.some(_.get(this, 'props.exportedFacts'), id, 'metric_id')

    return (
      <Metric
        canvasState={this.props.denormalizedSpace.canvasState}
        key={metric.id}
        metric={metric}
        idMap={idMap}
        organizationId={organizationId}
        canUseOrganizationFacts={canUseOrganizationFacts}
        exportedAsFact={exportedAsFact}
        analyzedMetric={passAnalyzed ? analyzed : null}
      />
    )
  }

  showEdges() {
    return (this.props.denormalizedSpace.canvasState.edgeView === 'visible')
  }

  getSelectedLineage(selectedRegion) {
    const {denormalizedSpace: {metrics}} = this.props
    const selectedMetrics = metrics.filter(m => isWithinRegion(m.location, selectedRegion))

    let ancestors = [...selectedMetrics], descendants = [...selectedMetrics]
    const getAncestors = metrics => _.uniq(_.flatten(metrics.map(m => m.edges.inputs))).filter(id => !_.some(ancestors, a => a.id === id)).map(this.findMetric.bind(this))
    const getDescendants = metrics => _.uniq(_.flatten(metrics.map(m => m.edges.outputs))).filter(id => !_.some(descendants, d => d.id === id)).map(this.findMetric.bind(this))

    let nextAncestors = getAncestors(ancestors)
    let nextDescendants = getDescendants(descendants)

    while (nextAncestors.length > 0 || nextDescendants.length > 0) {
      ancestors = [...ancestors, ...nextAncestors]
      descendants = [...descendants, ...nextDescendants]

      nextAncestors = getAncestors(nextAncestors)
      nextDescendants = getDescendants(nextDescendants)
    }

    return {ancestors, descendants}
  }

  findMetric(metricId) {
    return this.props.denormalizedSpace.metrics.find(m => m.id === metricId)
  }

  edges() {
    if (!this.showEdges()) { return [] }

    const {selectedRegion, denormalizedSpace: {metrics, edges}} = this.props
    const selectedMetrics = metrics.filter(m => isWithinRegion(m.location, selectedRegion))

    const hasSelectedMetrics = _.some(metrics, m => isWithinRegion(m.location, selectedRegion))
    const unconnectedStatus = hasSelectedMetrics ? 'unconnected' : 'default'

    const {ancestors, descendants} = this.getSelectedLineage(selectedRegion)

    return edges.map(e => {
      const {id: inputId, location: input, simulation} = this.findMetric(e.input)
      const {id: outputId, location: output} = this.findMetric(e.output)
      const outputIsAncestor = _collections.some(ancestors, outputId)
      const inputIsDescendant = _collections.some(descendants, inputId)

      const withinSelectedRegion = _collections.some(selectedMetrics, outputId) && _collections.some(selectedMetrics, inputId)

      let pathStatus = unconnectedStatus
      if (!withinSelectedRegion && (outputIsAncestor || inputIsDescendant)) {
        const degree = outputIsAncestor ?
          ancestors.findIndex(e => e.id === outputId) + 1
          :
          descendants.findIndex(e => e.id === inputId) + 1

        pathStatus = outputIsAncestor ? 'ancestor' : 'descendant'
        if (degree === 1) { pathStatus += '-1-degree' }
      }

      return {input, output, pathStatus, hasErrors: hasErrors(simulation), className: '' }
    })
  }

  onAutoFillRegion(region) {
    segment.trackAutoFill()
    this.props.dispatch(fillRegion(this.props.denormalizedSpace.id, region))
  }

  analyzedMetric() {
    const {metrics, canvasState} = this.props.denormalizedSpace
    const analysisMetricId = canvasState.analysisMetricId
    if (!_.isEmpty(analysisMetricId)){
      return metrics.find(e => e.id === analysisMetricId)
    }
    return false
  }

  render () {
    const {selectedCell, selectedRegion, copied} = this.props
    const {metrics, canvasState} = this.props.denormalizedSpace
    const {metricCardView} = canvasState
    const analyzedMetric = this.analyzedMetric()

    const edges = this.edges()
    let className = 'canvas-space'
    className += this.showEdges() ? ' showEdges' : ''
    className += this.props.screenshot ? ' overflow-hidden' : ''

    const showGridLines = (metricCardView !== 'display')

    const copiedRegion = (copied && (copied.pastedTimes < 1) && copied.region) || []
    const analyzedRegion = analyzedMetric ? [analyzedMetric.location, analyzedMetric.location] : []
    return (
      <div className={className}>
        <FlowGrid
          items={_.map(metrics, m => ({key: m.id, location: m.location, component: this.renderMetric(m, analyzedMetric)}))}
          onMultipleSelect={this._handleMultipleSelect.bind(this)}
          hasItemUpdated = {(oldItem, newItem) => hasMetricUpdated(oldItem.props, newItem.props)}
          isItemEmpty = {this.isMetricEmpty.bind(this)}
          edges={edges}
          selectedRegion={selectedRegion}
          copiedRegion={copiedRegion}
          selectedCell={selectedCell}
          analyzedRegion={analyzedRegion}
          onUndo={this._handleUndo.bind(this)}
          onRedo={this._handleRedo.bind(this)}
          onSelectItem={this._handleSelect.bind(this)}
          onDeSelectAll={this._handleDeSelectAll.bind(this)}
          onAutoFillRegion={this.onAutoFillRegion.bind(this)}
          onAddItem={this._handleAddMetric.bind(this)}
          onMoveItem={this._handleMoveMetric.bind(this)}
          onRemoveItems={(ids) => {this.props.dispatch(removeMetrics(ids))}}
          onCopy={this.props.onCopy}
          onPaste={this.props.onPaste}
          onCut={this.props.onCut}
          showGridLines={showGridLines}
          canvasState={canvasState}
        />
      </div>
    );
  }
}
