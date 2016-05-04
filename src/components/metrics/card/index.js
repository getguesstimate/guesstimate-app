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
import MetricCardViewSection from './MetricCardViewSection/index.js'

import { hasMetricUpdated } from './updated.js'

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

const PT = PropTypes
class MetricCard extends Component {
  displayName: 'MetricCard'

  static propTypes = {
    canvasState: canvasStateProps.canvasState,
    dispatch: PT.func.isRequired,
    gridKeyPress: PT.func.isRequired,
    guesstimateForm: PT.object.isRequired,
    handleSelect: PT.func.isRequired,
    isSelected: PT.bool.isRequired,
    location: PT.shape({
      row: PT.number,
      column: PT.number
    }),
    metric: PT.object.isRequired
  }

  state = {modalIsOpen: false};

  shouldComponentUpdate(nextProps, nextState) {
    return hasMetricUpdated(this.props, nextProps) || (this.state.modalIsOpen !== nextState.modalIsOpen)
  }

  componentDidUpdate() {
    const hasContent = this.refs.MetricCardViewSection.hasContent()
    if (!this.props.isSelected && this._isEmpty() && !hasContent){
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
      if (e.keyCode == '13') {
        e.preventDefault()
        this.openModal()
      } else if (e.keyCode == '8') {
        e.preventDefault()
        this.handleRemoveMetric()
      }
      this.props.gridKeyPress(e)
    }
    e.stopPropagation()
  }

  _isEmpty(){
    return (!this._hasGuesstimate() && !this._hasName())
  }

  _hasName(){
    return !!this.props.metric.name
  }

  _hasGuesstimate(){
    const {metric} = this.props
    const hasInput = !_.isEmpty(_.get(metric, 'guesstimate.input'))
    const hasData = !_.isEmpty(_.get(metric, 'guesstimate.data'))
    return (hasInput || hasData)
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

  _handleMouseUp(e) {
    if (this._isSelectable(e) && !this._isFunctionInputSelectable(e)) {
      this.props.handleSelect(this.props.location)
    }
  }

  _handleMouseDown(e) {
    if (this._isFunctionInputSelectable(e)) {
        e.preventDefault()
        $(window).trigger('functionMetricClicked', this.props.metric)
    }
  }

  _isSelectable(e) {
    const selectableEl = (e.target.parentElement.getAttribute('data-select') !== 'false')
    const notYetSelected = !this.props.isSelected
    return (selectableEl && notYetSelected)
  }

  _isFunctionInputSelectable(e) {
    return (this._isSelectable(e) && (this.props.canvasState.metricClickMode === 'FUNCTION_INPUT_SELECT'))
  }

  _className() {
    const {isSelected, metric, hovered} = this.props
    const {canvasState: {metricCardView}} = this.props
    const relationshipClass = relationshipClasses[relationshipType(metric.edges)]

    const titleView = !hovered && !isSelected && this._isTitle()
    let className = isSelected ? 'metricCard grid-item-focus' : 'metricCard'
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

  render() {
    const {isSelected, metric, guesstimateForm, canvasState} = this.props
    const {guesstimate} = metric
    const errors = this._errors()

    return (
      <div className='metricCard--Container'
          ref='dom'
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
              isSelected={isSelected}
              onChangeName={this.handleChangeMetric.bind(this)}
              guesstimateForm={guesstimateForm}
              onOpenModal={this.openModal.bind(this)}
              jumpSection={this._focusForm.bind(this)}
              onMouseDown={this._handleMouseDown.bind(this)}
              onMouseUp={this._handleMouseUp.bind(this)}
              ref='MetricCardViewSection'
              isTitle={this._isTitle()}
              connectDragSource={this.props.connectDragSource}
          />

          {isSelected && !this.state.modalIsOpen &&
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
        {this.props.hovered && !isSelected && <MetricToolTip guesstimate={guesstimate}/>}
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
