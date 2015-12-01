import React, {Component, PropTypes} from 'react'
import GuesstimateForm from './guesstimate_form';
import './style.css'

//At this point, MetricEditingPane doesn't seem very useful.
//It should be removed unless future coder finds use for it.

export default class MetricEditingPane extends Component {
  static propTypes = {
    guesstimate: PropTypes.object.isRequired,
    guesstimateForm: PropTypes.object.isRequired,
    metricId: PropTypes.string.isRequired,
    metricFocus: PropTypes.func.isRequired,
    onChangeGuesstimate: PropTypes.func.isRequired,
  }

  render() {
    return (
      <GuesstimateForm
          guesstimate={this.props.guesstimate}
          guesstimateForm={this.props.guesstimateForm}
          metricFocus={this.props.metricFocus}
          metricId={this.props.metricId}
          onSubmit={this.props.onChangeGuesstimate}
          size={this.props.size}
          ref='form'
      />
    )
  }
};

