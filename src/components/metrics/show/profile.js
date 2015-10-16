import React, {Component, PropTypes} from 'react'
import { connect } from 'react-redux';
import { denormalizedSpaceSelector } from '../../spaces/denormalized-space-selector.js';
import style from '../../spaces/show/style.css'
import Icon from 'react-fa'
import * as Space from 'gEngine/space';
import SimulationHistogram from 'gComponents/simulations/histogram'
import StatTable from 'gComponents/simulations/stat_table';
import _ from 'lodash'

function mapStateToProps(state) {
  return {
    me: state.me,
  }
}

export default class MetricProfile extends Component {
  displayName: 'MetricProfile'
  render () {
    const metric = this.props.metric
    return (
    <div>
      <SimulationHistogram simulation={metric.simulation}/>
    </div>
    )
  }
}
