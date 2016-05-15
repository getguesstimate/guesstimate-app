import React, {Component, PropTypes} from 'react'
import ReactDOM from 'react-dom'

import { connect } from 'react-redux';
import { removeMetric, changeMetric } from 'gModules/metrics/actions.js'
import { changeGuesstimate } from 'gModules/guesstimates/actions.js'
import { changeGuesstimateForm } from 'gModules/guesstimate_form/actions.js'

import MetricModal from '../modal/index.js'
import DistributionEditor from 'gComponents/distributions/editor/index.js'
import MetricToolTip from './tooltip.js'
import $ from 'jquery'
import './style.css'
import * as canvasStateProps from 'gModules/canvas_state/prop_type.js'
import ToolTip from 'gComponents/utility/tooltip/index.js'
import MetricCardViewSection from './MetricCardViewSection/index.js'
import SensitivitySection from './SensitivitySection/SensitivitySection.js'

import { hasMetricUpdated } from './updated.js'

import {PTLocation} from 'lib/locationUtils.js'

const INTERMEDIATE = 'INTERMEDIATE'
const OUTPUT = 'OUTPUT'
const INPUT = 'INPUT'
const NOEDGE = 'NOEDGE'

const relationshipClasses = {}
relationshipClasses[INTERMEDIATE] = 'intermediate'
relationshipClasses[OUTPUT] = 'output'
relationshipClasses[INPUT] = 'input'
relationshipClasses[NOEDGE] = 'noedge'

const relationshipType = (edges) => {
  if (edges.inputs.length && edges.outputs.length) { return INTERMEDIATE }
  if (edges.inputs.length) { return OUTPUT }
  if (edges.outputs.length) { return INPUT }
  return NOEDGE
}

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
class MetricCard extends Component {
  displayName: 'MetricCard'

  static propTypes = {
    canvasState: canvasStateProps.canvasState,
    dispatch: PT.func.isRequired,
    gridKeyPress: PT.func.isRequired,
    guesstimateForm: PT.object.isRequired,
    inSelectedCell: PT.bool.isRequired,
    location: PTLocation,
    metric: PT.object.isRequired
  }

  state = {modalIsOpen: false};

  shouldComponentUpdate(nextProps, nextState) {
    return hasMetricUpdated(this.props, nextProps) || (this.state.modalIsOpen !== nextState.modalIsOpen)
  }

  componentDidUpdate() {
    const hasContent = this.refs.MetricCardViewSection.hasContent()
    if (!this.props.inSelectedCell && this._isEmpty() && !hasContent && !this.state.modalIsOpen){
      this.handleRemoveMetric()
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

  handleChangeMetric(values) {
    values.id = this._id()
    this.props.dispatch(changeMetric(values))
  }

  handleChangeGuesstimate(values) {
    let guesstimate = values
    guesstimate.metric = this.props.metric.id
    this.props.dispatch(changeGuesstimate(this._id(), guesstimate))
    this.props.dispatch(changeGuesstimateForm(guesstimate, true))
  }

  handleRemoveMetric () {
    this.props.dispatch(removeMetric(this._id()))
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

  _errors() {
    if (this.props.isTitle){ return [] }
    let errors = _.get(this.props.metric, 'simulation.sample.errors')
    return errors ? errors.filter(e => !!e) : []
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
    const {inSelectedCell, metric, guesstimateForm, canvasState} = this.props
    const {guesstimate} = metric
    const errors = this._errors()
    const shouldShowSensitivitySection = this._shouldShowSensitivitySection()

    return (
      <div className='metricCard--Container'
          ref='dom'
          onKeyPress={this._handleKeyPress.bind(this)}
          onKeyDown={this._handleKeyDown.bind(this)}
          tabIndex='0'
        >
        <div
            className={this._className()}
        >

          <MetricModal
              metric={metric}
              guesstimateForm={guesstimateForm}
              isOpen={this.state.modalIsOpen}
              closeModal={this.closeModal.bind(this)}
              onChange={this.handleChangeGuesstimate.bind(this)}
          />

          <MetricCardViewSection
              canvasState={canvasState}
              metric={metric}
              inSelectedCell={inSelectedCell}
              onChangeName={this.handleChangeMetric.bind(this)}
              guesstimateForm={guesstimateForm}
              onOpenModal={this.openModal.bind(this)}
              jumpSection={this._focusForm.bind(this)}
              onMouseDown={this._handleMouseDown.bind(this)}
              ref='MetricCardViewSection'
              isTitle={this._isTitle()}
              connectDragSource={this.props.connectDragSource}
              selectedMetric={this.props.selectedMetric}
              showSensitivitySection={shouldShowSensitivitySection}
          />

          {inSelectedCell && !this.state.modalIsOpen &&
            <div className='section editing'>
              <DistributionEditor
                  metricId={metric.id}
                  metricFocus={this.focus.bind(this)}
                  onOpen={this.openModal.bind(this)}
                  ref='DistributionEditor'
                  size='small'
                  errors={errors}
              />
            </div>
          }
        </div>
        {this.props.hovered && !inSelectedCell && !shouldShowSensitivitySection && <MetricToolTip guesstimate={guesstimate}/>}
        {this.props.hovered && !inSelectedCell && shouldShowSensitivitySection &&
          <ScatterTip yMetric={this.props.selectedMetric} xMetric={metric}/>
        }
      </div>
    );
  }
}

function select(state) {
  return {
    guesstimateForm: state.guesstimateForm
  }
}

module.exports = connect(select)(MetricCard);
