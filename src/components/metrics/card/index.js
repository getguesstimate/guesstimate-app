import React, {Component, PropTypes} from 'react'
import ReactDOM from 'react-dom'
import JSONTree from 'react-json-tree'

import { connect } from 'react-redux';
import { removeMetric, changeMetric } from 'gModules/metrics/actions.js';
import { submitManualGuesstimate } from 'gModules/guesstimates/actions.js';

import Histogram from 'gComponents/simulations/histogram'
import MetricModal from './modal.js'
import StatTable from 'gComponents/simulations/stat_table'
import EditingPane from './editing_pane';
import DistributionSummary from './simulation_summary'
import Header from './header'
import Icon from 'react-fa'
import $ from 'jquery'
import './style.css'

const PT = PropTypes
class Metric extends Component {
  displayName: 'Metric'

  static propTypes = {
    canvasState: PT.shape({
      metricCardView: PT.oneOf([
        'normal',
        'basic',
        'scientific',
        'debugging',
      ]).isRequired,
      metricClickMode: PT.oneOf([
        'DEFAULT',
        'FUNCTION_INPUT_SELECT'
      ])
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
    metric: PT.object.isRequired
  }

  state = {modalIsOpen: false};

  componentDidUpdate() {
    if (!this.props.isSelected && this._isEmpty() && !this.refs.header.hasContent()){
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
    return (!metric.name && !_.get(metric, 'guesstimate.input') && !_.get(metric, 'guesstimate.guesstimateType'))
  }

  handleChangeMetric(values) {
    values.id = this._id()
    this.props.dispatch(changeMetric(values))
  }

  handleChangeGuesstimate(values) {
    let guesstimate = values
    guesstimate.metric = this.props.metric.id
    this.props.dispatch(submitManualGuesstimate(this._id(), guesstimate))
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

  showStatistics() {
    return this.showSimulation() && (_.get(this.props, 'metric.simulation.stats').length > 1)
  }

  render() {
    const {isSelected, metric, guesstimateForm} = this.props
    const {canvasState: {metricCardView, metricClickMode}} = this.props

    const anotherFunctionSelected = ((metricClickMode === 'FUNCTION_INPUT_SELECT') && !isSelected)

    const showSimulation = this.showSimulation()
    const showStatistics = this.showStatistics()
    return (
      <div
          className={isSelected ? 'metric grid-item-focus' : 'metric'}
          ref='dom'
          onKeyDown={this._handlePress.bind(this)}
          onMouseDown={this._handleClick.bind(this)}
          tabIndex='0'
      >
      <MetricModal
          metric={metric}
          guesstimateForm={guesstimateForm}
          isOpen={this.state.modalIsOpen}
          closeModal={this.closeModal.bind(this)}
      />

        <div className={`card-top metric-container ${metricCardView}`}>
          {(metricCardView !== 'basic') && showSimulation &&
            <Histogram height={(metricCardView === 'scientific') ? 75 : 30}
                simulation={metric.simulation}
            />
          }
          <Header
              anotherFunctionSelected={anotherFunctionSelected}
              isSelected={isSelected}
              name={metric.name}
              onChange={this.handleChangeMetric.bind(this)}
              readableId={metric.readableId}
              ref='header'
          />
          <div className='row row1'>
            <div className='col-xs-12 mean'>
              {showSimulation &&
                <DistributionSummary
                    guesstimateForm={guesstimateForm}
                    simulation={metric.simulation}
                />
              }
            </div>
          </div>

          {(metricCardView === 'debugging') &&
            <JSONTree data={this.props}/>
          }
          {(metricCardView === 'scientific') && showStatistics &&
            <StatTable stats={metric.simulation.stats}/>
          }

          <span
              className='hover-toggle'
              onMouseDown={this.openModal.bind(this)}
              ref='modalLink'
              data-select='false'
          >
            <Icon name='expand'/>
          </span>
        </div>
        {isSelected && !_.isUndefined(metric.guesstimate) &&
          <EditingPane
              guesstimate={metric.guesstimate}
              guesstimateForm={guesstimateForm}
              metricFocus={this.focus.bind(this)}
              metricId={metric.id}
              onChangeGuesstimate={this.handleChangeGuesstimate.bind(this)}
          />
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

module.exports = connect(select)(Metric);
