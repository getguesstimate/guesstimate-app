'use strict';

import _ from 'lodash'
import React, {Component, PropTypes} from 'react'
import $ from 'jquery'

import Grid from '../grid/grid'
import Metric from './metric'
import styles from './canvas-space.styl'

import { connect } from 'react-redux';
import { addMetric } from '../../actions/metric-actions'
import { changeSelect } from '../../actions/selection-actions'
import { addMetricInputToDistributionForm } from '../../actions/distribution-form-actions'
import { canvasStateSelector } from '../../selectors/canvas-state-selector';

function mapStateToProps(state) {
  return {
    selected: state.selection,
    metrics: state.metrics,
  }
}

@connect(mapStateToProps)
@connect(canvasStateSelector)
export default class CanvasSpace extends Component{
  _handleSelect(event, location, item) {
    if (!_.isEqual(this.props.selected, location)){
      if ((this.props.canvasState == 'function') && item) {
        event.preventDefault()
        $(window).trigger('functionMetricClicked', item.props.metric)
      } else {
        this.props.dispatch(changeSelect(location))
      }
    }
  }
  _handleAddMetric(location) {
    this.props.dispatch(addMetric(location))
  }
  render () {
    return (
      <div className="canvas-space">
        <Grid selected={this.props.selected} handleSelect={this._handleSelect.bind(this)} onAddItem={this._handleAddMetric.bind(this)}>
          {
            this.props.metrics.map((m) => {
              return (<Metric metric={m} key={m.id} location={m.location} canvasState={this.props.canvasState}/>)
            })
          }
        </Grid>
      </div>
    );
  }
}
