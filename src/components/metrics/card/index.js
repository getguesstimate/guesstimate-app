import React, {Component, PropTypes} from 'react'
import ReactDOM from 'react-dom'
import JSONTree from 'react-json-tree'
import _ from 'lodash'

import { connect } from 'react-redux';
import { removeMetric, changeMetric } from 'gModules/metrics/actions.js';
import { changeGuesstimate } from 'gModules/guesstimates/actions.js';
import { changeSelect } from 'gModules/selection/actions'

import Histogram from 'gComponents/simulations/histogram'
import StatTable from 'gComponents/simulations/stat_table'
import EditingPane from './editing_pane';
import DistributionSummary from './simulation_summary'
import Header from './header'
import $ from 'jquery'
import './style.css'
import {DragSource} from 'react-dnd'

const PT = PropTypes
class Metric extends Component {
  displayName: 'Metric'

  static propTypes = {
    canvasState: PT.shape({
      metricCardView: PT.oneOf([
        'normal',
        'scientific',
        'debugging',
      ]).isRequired,
    }),
    dispatch: PT.func.isRequired,
    gridKeyPress: PT.func.isRequired,
    guesstimateForm: PT.object.isRequired,
    handleSelect: PT.func.isRequired,
    isSelected: PT.bool.isRequired,
    location: PT.shape({
      row: PT.number,
      column: PT.number
    }),
    metric: PT.object.isRequired,
    userAction: PT.oneOf([
      'selecting',
      'function',
      'estimate',
      'editing'
    ]).isRequired
  }

  componentDidUpdate() {
    if (!this.props.isSelected && this._isEmpty() && !this.refs.header.hasContent()){
        this.handleRemoveMetric()
    }
  }

  _handleClick(event) {
    if (!this.props.isSelected){
      if (this.props.userAction == 'function') {
        event.preventDefault()
        $(window).trigger('functionMetricClicked', this.props.metric)
      } else {
        this.props.handleSelect(this.props.location)
      }
    }
  }

  _handlePress(e) {
    if (e.target === ReactDOM.findDOMNode(this)) {
      if (e.keyCode == '8') {
        e.preventDefault()
        this.handleRemoveMetric()
      }
      this.props.gridKeyPress(e)
    }
    e.stopPropagation()
  }

  _isEmpty(){
    const {metric} = this.props
    return (!metric.name && !_.get(metric, 'guesstimate.input'))
  }

  handleChangeMetric(values) {
    values.id = this._id()
    this.props.dispatch(changeMetric(values))
  }

  handleChangeGuesstimate(values) {
    this.props.dispatch(changeGuesstimate(this._id(), values))
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

  render() {
    const {isSelected, metric, guesstimateForm, userAction} = this.props
    const {canvasState: {metricCardView}} = this.props

    const anotherFunctionSelected = ((userAction === 'function') && !isSelected)

    return (
      <div
        className={isSelected ? 'metric grid-item-focus' : 'metric'}
        onKeyDown={this._handlePress.bind(this)}
        onMouseDown={this._handleClick.bind(this)}
        tabIndex='0'
        ref='dom'
        >

        <div className={`card-top metric-container ${metricCardView}`}>
          <Header
              anotherFunctionSelected={anotherFunctionSelected}
              name={metric.name}
              onChange={this.handleChangeMetric.bind(this)}
              readableId={metric.readableId}
              ref='header'
          />
          <div className='row row1'>
            <div className='col-xs-12 mean'>
              <DistributionSummary
                  guesstimateForm={guesstimateForm}
                  simulation={metric.simulation}
              />
            </div>
          </div>

          {(metricCardView === 'debugging') &&
            <JSONTree data={this.props}/>
          }
          {(metricCardView === 'scientific') && _.get(metric, 'simulation.stats') &&
            <StatTable stats={metric.simulation.stats}/>
          }
        </div>
        <EditingPane
             guesstimate={metric.guesstimate}
             guesstimateForm={guesstimateForm}
             metricFocus={this.focus.bind(this)}
             metricId={metric.id}
             onChangeGuesstimate={this.handleChangeGuesstimate.bind(this)}
             showIf={isSelected && !_.isUndefined(metric.guesstimate)}
        />
      </div>
    );
  }
}

function select(state) {
  return {
    guesstimateForm: state.guesstimateForm
  }
}

module.exports = connect(select)(Metric);
