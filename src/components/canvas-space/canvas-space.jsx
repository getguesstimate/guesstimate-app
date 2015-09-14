'use strict';

import React, {Component, PropTypes} from 'react'
import Grid from '../grid/grid'
import Metric from './canvas-metric'
import Input from 'react-bootstrap/lib/Input'
import _ from 'lodash'
import styles from './canvas-space.styl'

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { addMetric } from '../../actions/metric-actions'
import { changeSelect } from '../../actions/selection-actions'
import { addMetricInputToDistributionForm } from '../../actions/distribution-form-actions'
import { canvasStateSelector } from '../../selectors/canvas-state-selector';

function mapStateToProps(state) {
  return {
    selected: state.selection,
    items: state.metrics,
  }
}

@connect(mapStateToProps)
@connect(canvasStateSelector)
export default class CanvasPage extends Component{
  _handleSelect = (e) => {
    console.log(this.props.canvasState == 'function')
    if (!_.isEqual(this.props.selected, e)){
        debugger
      if (this.props.canvasState == 'function') {
        console.log('trye')
        this.props.dispatch(addMetricInputToEditingMetric(e))
      } else {
        console.log('false')
        this.props.dispatch(changeSelect(e))
      }
    }
  }
  _handleAddItem = (location) => {
    this.props.dispatch(addMetric(location))
  }
  render () {
    return (
      <div className="canvas-space">
      <Grid selected={this.props.selected} handleSelect={this._handleSelect.bind(this)} onAddItem={this._handleAddItem}>
            {this.props.items.map((i) => {
              return (<Metric item={i} key={JSON.stringify(i)} canvasState={this.props.canvasState}/>)
              })
            }
        </Grid>
      </div>
    );
  }
}

