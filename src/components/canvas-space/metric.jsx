import React, {Component, PropTypes} from 'react'
import Button from 'react-bootstrap/lib/Button'
import Label from 'react-bootstrap/lib/Label'
import _ from 'lodash'
import ReactFitText from 'react-fittext'

import { connect } from 'react-redux';
import { removeMetric, changeMetric } from '../../actions/metric-actions.js';
import { changeGuesstimate } from '../../actions/guesstimate-actions.js';
import MetricSelected from './metric-selected';
import DistributionSummary from './distribution-summary'
import GuesstimateForm from './guesstimate-form'
import addons from "react/addons";
let {addons: {CSSTransitionGroup}} = addons;
let ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;
import Histogram from './histogram'


class MetricUnselected extends Component{
  format(n){
    if (n) {
      let value = parseFloat(n);
      return numeral(value).format('0.0a')
    }
  }
  render () {
    let tag = (
     <div className='col-sm-2 function-id'>
       {this.props.canvasState == 'function' ? (<Label bsStyle="success">{this.props.metric.readableId}</Label>) : ''}
     </div>
    )
    //let showDistribution = !_.isEmpty(this.props.guesstimateForm) ? this.props.guesstimateForm : this.props.guesstimate
    let values = this.props.metric.simulation ? this.props.metric.simulation.sample.values : null
    //let showDistribution = this.props.metric.simulation ? this.props.metric
    let histogram = (
      <Histogram data={values} width={400} height={60}/>
    )
    return(
      <div className='metric'>
        {values ? histogram : ''}
         <div className='row'>
           <div className={this.props.canvasState == 'function' ? 'col-sm-8 name' : 'col-sm-12 name'}>
             {this.props.metric.name}
           </div>
           {this.props.metric.simulation && this.props.metric.simulation.sample.values.slice(-1)[0]}
           {this.props.canvasState == 'function' ? tag : ''}
         </div>
         <div className='row row1'>
           <div className='col-sm-12 mean'>
             <DistributionSummary distribution={this.props.guesstimate && this.props.guesstimate.distribution}/>
           </div>
         </div>
      </div>
    )
  }
}

class EditingPane extends Component {
  _handlePress(e) {
    e.stopPropagation()
  }
  render() {
    return (
      <ReactCSSTransitionGroup transitionEnterTimeout={500} transitionName='carousel' transitionAppear={true}>
      <div className='editing-section'>
        <div className='row'>
          <div onKeyDown={this._handlePress} className='col-xs-12'>
            <GuesstimateForm value={this.props.guesstimate.input} guesstimate={this.props.guesstimate} guesstimateForm={this.props.guesstimateForm} onSubmit={this.props.onChangeGuesstimate}/>
          </div>
        </div>
        <div className='row'>
          <div className='col-xs-12'>
          </div>
        </div>
      </div>
      </ReactCSSTransitionGroup>
    )
  }
};

const Metric = React.createClass({
  handleChangeMetric(values) {
    this.props.dispatch(changeMetric(this._id(), values))
  },
  handleChangeGuesstimate(values) {
    this.props.dispatch(changeGuesstimate(this._id(), values))
  },
  handleRemoveMetric () {
    this.props.dispatch(removeMetric(this._id()))
  },
  _id(){
    return this.props.metric.id
  },
  regularView() {
    return (
      <MetricUnselected
        metric={this.props.metric}
        guesstimate={this.props.guesstimate}
        canvasState={this.props.canvasState}
      />
    )
  },
  editView() {
    return (
      <MetricSelected
        metric={this.props.metric}
        guesstimate={this.props.guesstimate}
        guesstimateForm={this.props.guesstimateForm}
        canvasState={this.props.canvasState}
        onRemoveMetric={this.handleRemoveMetric}
        gridKeyPress={this.props.gridKeyPress}
        onChangeMetric={this.handleChangeMetric}
      />
    )
  },
  render () {
    let metricType = this.props.isSelected ?  this.editView() : this.regularView()
    return (
      <div>
      {metricType}
      {this.props.isSelected ? <EditingPane onChangeGuesstimate={this.handleChangeGuesstimate} guesstimate={this.props.guesstimate} guesstimateForm={this.props.guesstimateForm}/> : ''}
      </div>
    )
  }
})

function select(state) {
  return {
    guesstimateForm: state.guesstimateForm
  }
}

module.exports = connect(select)(Metric);
