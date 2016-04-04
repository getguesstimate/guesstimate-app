import React, {Component, PropTypes} from 'react'
import ReactDOM from 'react-dom'
import JSONTree from 'react-json-tree'

import { connect } from 'react-redux';
import { removeMetric, changeMetric } from 'gModules/metrics/actions.js';
import { changeGuesstimate } from 'gModules/guesstimates/actions.js';

import Histogram from 'gComponents/simulations/histogram'
import MetricModal from '../modal/index.js'
import StatTable from 'gComponents/simulations/stat_table'
import DistributionEditor from 'gComponents/distributions/editor/index.js'
import DistributionSummary from 'gComponents/distributions/summary/index.js'
import MetricToolTip from './tooltip.js'
import MetricName from './name'
import Icon from 'react-fa'
import $ from 'jquery'
import MetricToken from './token/index.js'
import './style.css'
import * as canvasStateProps from 'gModules/canvas_state/prop_type.js'

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

  componentDidUpdate() {
    const hasContent = _.has(this, 'refs.name') && this.refs.name.hasContent()
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

  _handleClick(event) {
    const selectableEl = (event.target.parentElement.getAttribute('data-select') !== 'false')
    const notYetSelected = !this.props.isSelected
    if (selectableEl && notYetSelected){
      if (this.props.canvasState.metricClickMode === 'FUNCTION_INPUT_SELECT') {
        event.preventDefault()
        $(window).trigger('functionMetricClicked', this.props.metric)
      } else {
        this.props.handleSelect(this.props.location)
      }
    }
  }

  _handlePress(e) {
    if (e.target === ReactDOM.findDOMNode(this)) {
      if (e.keyCode == '13') {
        e.preventDefault()
        this.openModal()
      }
      if (e.keyCode == '8') {
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

  showSimulation() {
    const stats = _.get(this.props, 'metric.simulation.stats')
    if (stats && _.isFinite(stats.mean) && _.isFinite(stats.stdev) && _.isFinite(stats.length)) {
      return (stats.stdev === 0 || (stats.length > 5))
    } else {
      return false
    }
  }

  _shouldShowStatistics() {
    const isScientific = (this.props.canvasState.metricCardView === 'scientific')
    const isAvailable = this.showSimulation() && (_.get(this.props, 'metric.simulation.stats').length > 1)
    return isScientific && isAvailable
  }

  _focusForm() {
    const editorRef = _.get(this.refs, 'DistributionEditor.refs.wrappedInstance')
    editorRef && editorRef.focus()
  }

  render() {
    const {isSelected, metric, guesstimateForm} = this.props
    const {canvasState: {metricCardView, metricClickMode}} = this.props
    const {guesstimate} = metric

    const anotherFunctionSelected = ((metricClickMode === 'FUNCTION_INPUT_SELECT') && !isSelected)

    const showSimulation = this.showSimulation()
    const shouldShowStatistics = this._shouldShowStatistics()
    const shouldShowJsonTree = (metricCardView === 'debugging')
    const hasGuesstimateDescription = !_.isEmpty(guesstimate.description)

    const titleView = !this.props.hovered && !isSelected && this._isTitle()

    let className = isSelected ? 'metricCard grid-item-focus' : 'metricCard'
    className += ` ${metricCardView}`
    className += titleView ? ' titleView' : ''

    return (
      <div
          className={className}
          ref='dom'
          onKeyDown={this._handlePress.bind(this)}
          onMouseDown={this._handleClick.bind(this)}
          tabIndex='0'
      >
        {this.props.hovered && !isSelected &&
          <MetricToolTip guesstimate={guesstimate}/>
        }

        <MetricModal
            metric={metric}
            guesstimateForm={guesstimateForm}
            isOpen={this.state.modalIsOpen}
            closeModal={this.closeModal.bind(this)}
            onChange={this.handleChangeGuesstimate.bind(this)}
        />

        <div className={`section ${metricCardView}`}>

          {(metricCardView !== 'basic') && showSimulation &&
            <Histogram height={(metricCardView === 'scientific') ? 75 : 30}
                simulation={metric.simulation}
                cutOffRatio={0.995}
            />
          }

          <div className='row '>
            <div className='col-xs-10 sqwish-right'>
              <div className='row'>
                {(!_.isEmpty(metric.name) || isSelected) &&
                  <div className='col-xs-12'>
                    <MetricName
                      isSelected={isSelected}
                      name={metric.name}
                      onChange={this.handleChangeMetric.bind(this)}
                      jumpSection={this._focusForm.bind(this)}
                      ref='name'
                    />
                  </div>
                }

                <div className='col-xs-12'>
                  {showSimulation &&
                    <DistributionSummary
                        guesstimateForm={guesstimateForm}
                        simulation={metric.simulation}
                    />
                  }
                </div>
              </div>
            </div>

            <div className='col-xs-2 sqwish-middle'>
              <MetricToken
                 readableId={metric.readableId}
                 anotherFunctionSelected={anotherFunctionSelected}
                 onOpenModal={this.openModal.bind(this)}
                 hasGuesstimateDescription={hasGuesstimateDescription}
              />
            </div>
          </div>

          {shouldShowJsonTree &&
            <div className='row'> <div className='col-xs-12'> <JSONTree data={this.props}/> </div> </div>
          }

          {shouldShowStatistics &&
            <div className='row'> <div className='col-xs-12'> <StatTable stats={metric.simulation.stats}/> </div> </div>
          }

        </div>

        {isSelected && !this.state.modalIsOpen &&
          <div className='section editing'>
            <DistributionEditor
                metricId={metric.id}
                metricFocus={this.focus.bind(this)}
                onOpen={this.openModal.bind(this)}
                ref='DistributionEditor'
                size='small'
            />
          </div>
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
