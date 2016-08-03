import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'

import ReactDOM from 'react-dom'
import $ from 'jquery'

import {MetricModal} from 'gComponents/metrics/modal/index'
import DistributionEditor from 'gComponents/distributions/editor/index'
import MetricToolTip from './tooltip'
import ToolTip from 'gComponents/utility/tooltip/index'
import {MetricCardViewSection} from './MetricCardViewSection/index'
import SensitivitySection from './SensitivitySection/SensitivitySection'

import {hasMetricUpdated} from './updated'
import {removeMetrics, changeMetric} from 'gModules/metrics/actions'
import {changeGuesstimate} from 'gModules/guesstimates/actions'

import * as canvasStateProps from 'gModules/canvas_state/prop_type'
import {PTLocation} from 'lib/locationUtils'

import {INTERMEDIATE, OUTPUT, INPUT, NOEDGE, relationshipType} from 'gEngine/graph'

import './style.css'

const relationshipClasses = {}
relationshipClasses[INTERMEDIATE] = 'intermediate'
relationshipClasses[OUTPUT] = 'output'
relationshipClasses[INPUT] = 'input'
relationshipClasses[NOEDGE] = 'noedge'

class ScatterTip extends Component {
  render() {
    return (
      <ToolTip size='LARGE'>
        <SensitivitySection yMetric={this.props.yMetric} xMetric={this.props.xMetric} size={'LARGE'}/>
      </ToolTip>
    )
  }
}

const PT = PropTypes

@connect(null, dispatch => bindActionCreators({changeMetric, changeGuesstimate, removeMetrics}, dispatch))
export default class MetricCard extends Component {
  displayName: 'MetricCard'

  static propTypes = {
    canvasState: canvasStateProps.canvasState,
    changeMetric: PT.func.isRequired,
    changeGuesstimate: PT.func.isRequired,
    removeMetrics: PT.func.isRequired,
    gridKeyPress: PT.func.isRequired,
    inSelectedCell: PT.bool.isRequired,
    location: PTLocation,
    metric: PT.object.isRequired
  }

  state = {
    modalIsOpen: false,
    editing: false,
  }

  shouldComponentUpdate(nextProps, nextState) {
    return hasMetricUpdated(this.props, nextProps) || (this.state.modalIsOpen !== nextState.modalIsOpen)
  }

  onEdit() {
    if (!this.state.editing) { this.setState({editing: true}) }
  }

  focusFromDirection(dir) {
    if (dir === 'DOWN' || dir === 'RIGHT') { this._focusForm() }
    else { this.refs.MetricCardViewSection.focusName() }
  }

  componentWillUpdate(nextProps) {
    window.recorder.recordRenderStartEvent(this)
    if (this.state.editing && !nextProps.inSelectedCell) { this.setState({editing: false}) }
  }
  componentWillUnmount() { window.recorder.recordUnmountEvent(this) }

  componentDidUpdate(prevProps) {
    window.recorder.recordRenderStopEvent(this)

    const hasContent = this.refs.MetricCardViewSection.hasContent()
    const {inSelectedCell, selectedFrom} = this.props
    if (!inSelectedCell && this._isEmpty() && !hasContent && !this.state.modalIsOpen){
      this.handleRemoveMetric()
    }
    if (!prevProps.inSelectedCell && inSelectedCell && !!selectedFrom) {
      this.focusFromDirection(selectedFrom)
    }
  }

  componentDidMount() {
    window.recorder.recordMountEvent(this)
    if (this.props.inSelectedCell && this._isEmpty()) {
      this.focusFromDirection(this.props.selectedFrom)
    }
  }

  openModal() {
    this.setState({modalIsOpen: true});
  }

  closeModal() {
     this.setState({modalIsOpen: false});
  }

  _handleKeyDown(e) {
    if (e.target === ReactDOM.findDOMNode(this)) {
      if (e.keyCode == '13' && this.props.inSelectedCell) {
        e.preventDefault()
        e.stopPropagation()
        this.openModal()
      }
    }
  }

  _handleKeyPress(e) {
    if (e.target === ReactDOM.findDOMNode(this)) {
      this.props.gridKeyPress(e)
    }
    e.stopPropagation()
  }

  _isEmpty(){
    return !(this._hasGuesstimate() || this._hasName() || this._hasDescription())
  }

  _hasName(){
    return !!this.props.metric.name
  }

  _hasDescription(){
    return !!_.get(this.props.metric, 'guesstimate.description')
  }

  _hasGuesstimate(){
    const has = (item) => !!_.get(this.props.metric, `guesstimate.${item}`)
    return (has('input') || has('data'))
  }

  _isTitle(){
    return (this._hasName() && !this._hasGuesstimate())
  }

  onChangeMetricName(name) {
    this.props.changeMetric({id: this._id(), name})
  }

  onChangeGuesstimateDescription(description) {
    this.props.changeGuesstimate(this._id(), {...this.props.metric.guesstimate, description})
  }

  handleRemoveMetric () {
    this.props.removeMetrics([this._id()])
  }

  _id(){
    return this.props.metric.id
  }

  focus() {
    $(this.refs.dom).focus();
  }

  _focusForm() {
    const editorRef = _.get(this.refs, 'DistributionEditor.refs.wrappedInstance')
    editorRef && editorRef.focus()
  }

  _handleMouseDown(e) {
    if (this._isFunctionInputSelectable(e) && !e.shiftKey) {
      $(window).trigger('functionMetricClicked', this.props.metric)
      // TODO(matthew): Why don't these stop the triggering of the flow grid cell?
      e.preventDefault()
      e.stopPropagation()
    }
  }

  _isSelectable(e) {
    const selectableEl = (e.target.parentElement.getAttribute('data-select') !== 'false')
    const notYetSelected = !this.props.inSelectedCell
    return (selectableEl && notYetSelected)
  }

  _isFunctionInputSelectable(e) {
    return (this._isSelectable(e) && (this.props.canvasState.metricClickMode === 'FUNCTION_INPUT_SELECT'))
  }

  _className() {
    const {inSelectedCell, metric, hovered} = this.props
    const {canvasState: {metricCardView}} = this.props
    const relationshipClass = relationshipClasses[relationshipType(metric.edges)]

    const titleView = !hovered && !inSelectedCell && this._isTitle()
    let className = inSelectedCell ? 'metricCard grid-item-focus' : 'metricCard'
    className += ` ${metricCardView}`
    className += titleView ? ' titleView' : ''
    className += ' ' + relationshipClass
    return className
  }

  _shouldShowSimulation(metric) {
    const stats = _.get(metric, 'simulation.stats')
    return (stats && _.isFinite(stats.stdev) && (stats.length > 5))
  }

  _shouldShowSensitivitySection() {
    const {metric, selectedMetric} = this.props
    const isAnalysis = (this.props.canvasState.metricCardView === 'analysis')
    return !!(isAnalysis && selectedMetric && this._shouldShowSimulation(metric) && this._shouldShowSimulation(selectedMetric))
  }

  render() {
    const {
      inSelectedCell,
      metric,
      organizationId,
      canvasState,
      hovered,
      connectDragSource,
      selectedMetric,
      forceFlowGridUpdate,
      readableIdsMap,
    } = this.props
    const {guesstimate} = metric
    const shouldShowSensitivitySection = this._shouldShowSensitivitySection()

    return (
      <div className='metricCard--Container'
        ref='dom'
        onKeyPress={this._handleKeyPress.bind(this)}
        onKeyDown={this._handleKeyDown.bind(this)}
        tabIndex='0'
      >
        <div className={this._className()}>
          {this.state.modalIsOpen &&
            <MetricModal
              metric={metric}
              closeModal={this.closeModal.bind(this)}
              onChangeGuesstimateDescription={this.onChangeGuesstimateDescription.bind(this)}
            />
          }

          <MetricCardViewSection
            canvasState={canvasState}
            metric={metric}
            inSelectedCell={inSelectedCell}
            onChangeName={this.onChangeMetricName.bind(this)}
            onOpenModal={this.openModal.bind(this)}
            jumpSection={this._focusForm.bind(this)}
            onMouseDown={this._handleMouseDown.bind(this)}
            ref='MetricCardViewSection'
            isTitle={this._isTitle()}
            connectDragSource={connectDragSource}
            selectedMetric={selectedMetric}
            showSensitivitySection={shouldShowSensitivitySection}
            heightHasChanged={forceFlowGridUpdate}
            hovered={hovered}
            editing={this.state.editing}
            onEscape={this.focus.bind(this)}
            onReturn={this.props.onReturn}
            onTab={this.props.onTab}
          />

          {inSelectedCell &&
            <div className='section editing'>
              <DistributionEditor
                guesstimate={metric.guesstimate}
                inputMetrics={metric.edges.inputMetrics}
                metricId={metric.id}
                organizationId={organizationId}
                readableIdsMap={readableIdsMap}
                metricFocus={this.focus.bind(this)}
                jumpSection={() => {this.refs.MetricCardViewSection.focusName()}}
                onOpen={this.openModal.bind(this)}
                ref='DistributionEditor'
                size='small'
                onReturn={this.props.onReturn}
                onTab={this.props.onTab}
                onEdit={this.onEdit.bind(this)}
              />
            </div>
          }
        </div>
        {hovered && !inSelectedCell && !shouldShowSensitivitySection && <MetricToolTip guesstimate={guesstimate}/>}
        {hovered && !inSelectedCell && shouldShowSensitivitySection &&
          <ScatterTip yMetric={selectedMetric} xMetric={metric}/>
        }
      </div>
    );
  }
}
