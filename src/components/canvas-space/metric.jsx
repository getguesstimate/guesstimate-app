import React, {Component, PropTypes} from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux';
import { removeMetric, changeMetric } from '../../actions/metric-actions.js';
import { changeGuesstimate } from '../../actions/guesstimate-actions.js';

import Label from 'react-bootstrap/lib/Label'
import _ from 'lodash'

import MetricStatTable from './MetricStatTable';
import MetricEditingPane from './MetricEditingPane.js';

import DistributionSummary from './distribution-summary'
import SimulationHistogram from './simulation-histogram.js'
import ShowIf from '../utility/showIf';

const MetricReadableIdd = ({canvasState, readableId}) => (
  <div className='col-sm-2 function-id'>
    {canvasState == 'function' ? (<Label bsStyle="success">{readableId}</Label>) : ''}
  </div>
)
const MetricReadableId = ShowIf(MetricReadableIdd)

class Metric extends Component {
  displayName: 'Metric'
  static propTypes = {
    canvasState: PropTypes.oneOf([
      'selecting',
      'function',
      'estimate',
      'editing'
    ]).isRequired,
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
    this.props.dispatch(changeMetric(this._id(), values))
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
    return(
      <div>
      <div
          className={isSelected ? 'metric grid-item-focus' : 'metric'}
          onKeyDown={this._handlePress.bind(this)}
          tabIndex='0'
      >
        <SimulationHistogram simulation={metric.simulation}/>
         <MetricStatTable
             showIf={_.has(metric, 'simulation.stats') && isSelected}
             stats={_.get(metric, 'simulation.stats')}
         />
         <div className='row'>
         <div className={canvasState == 'function' ? 'col-sm-8 name' : 'col-sm-12 name'}>
           {metric.name}
         </div>
         <MetricReadableId
             {...canvasState}
             readableId={metric.readableId}
             showIf={canvasState === 'function'}
         />
         </div>
         <div className='row row1'>
           <div className='col-sm-12 mean'>
             <DistributionSummary
                 guesstimateForm={guesstimateForm}
                 onChangeGuesstimate={this.handleChangeGuesstimate.bind(this)}
                 simulation={metric.simulation}
             />
           </div>
         </div>
      </div>
         <MetricEditingPane
             guesstimate={metric.guesstimate}
             guesstimateForm={guesstimateForm}
             onChangeGuesstimate={this.handleChangeGuesstimate.bind(this)}
              metricId={metric.id}
             showIf={isSelected}
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
