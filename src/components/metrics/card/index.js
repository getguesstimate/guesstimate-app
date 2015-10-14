import React, {Component, PropTypes} from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux';
import { removeMetric, changeMetric } from 'gModules/metrics/actions.js';
import { changeGuesstimate } from 'gModules/guesstimates/actions.js';
import _ from 'lodash'

import StatTable from 'gComponents/simulations/stat_table';
import SimulationHistogram from 'gComponents/simulations/histogram'

import EditingPane from './editing_pane';
import DistributionSummary from './simulation_summary'
import Header from './header'
import $ from 'jquery'
import './style.css'

class Metric extends Component {
  displayName: 'Metric'
  static propTypes = {
    canvasState: PropTypes.oneOf([
      'selecting',
      'function',
      'estimate',
      'editing'
    ]).isRequired,
    changeSelect: PropTypes.func,
    dispatch: PropTypes.func,
    gridKeyPress: PropTypes.func.isRequired,
    guesstimateForm: PropTypes.object,
    isSelected: PropTypes.bool,
    location: PropTypes.shape({
      row: PropTypes.number,
      column: PropTypes.number
    }),
    metric: PropTypes.object.isRequired,
  }

  _handleClick(event) {
    if (!this.props.isSelected){
      if (this.props.canvasState == 'function') {
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

  render () {
    const {isSelected, metric, canvasState, guesstimateForm} = this.props
    let anotherFunctionSelected = ((canvasState === 'function') && !isSelected)
    return(
      <div
          className={isSelected ? 'metric grid-item-focus' : 'metric'}
          tabIndex='0'
          onKeyDown={this._handlePress.bind(this)}
          onMouseDown={this._handleClick.bind(this)}

      >
        <div className={'card-top metric-container'}
        >
          <SimulationHistogram simulation={metric.simulation}/>
          <Header
              anotherFunctionSelected={anotherFunctionSelected}
              metric={metric}
              onChange={this.handleChangeMetric.bind(this)}
          />
          <div className='row row1'>
            <div className='col-xs-12 mean'>
              <DistributionSummary
                  guesstimateForm={guesstimateForm}
                  simulation={metric.simulation}
              />
            </div>
          </div>
        </div>
         <EditingPane
             guesstimate={metric.guesstimate}
             guesstimateForm={guesstimateForm}
             metricId={metric.id}
             onChangeGuesstimate={this.handleChangeGuesstimate.bind(this)}
             showIf={isSelected && !_.isUndefined(metric.guesstimate)}
         />
      </div>
    )
  }
}

function select(state) {
  return {
    guesstimateForm: state.guesstimateForm
  }
}

module.exports = connect(select)(Metric);
