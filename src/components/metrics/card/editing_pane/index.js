import React, {Component, PropTypes} from 'react'
import ReactCSSTransitionGroup from 'react/lib/ReactCSSTransitionGroup';
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

  componentWillUnmount() {
    const guesstimates = [this.props.guesstimateForm, this.props.guesstimate]
    const hasChanged = !_.isEqual(
        ...guesstimates.map(e => _.pick(e, ['input', 'guesstimateType']))
      )
    if (hasChanged) {
      this.props.onChangeGuesstimate(this.props.guesstimateForm)
    }
  }

  render() {
    return (
      <div className='metric-container editing-section' key={this.props.metricId}>
        <GuesstimateForm
            guesstimate={this.props.guesstimate}
            guesstimateForm={this.props.guesstimateForm}
            metricFocus={this.props.metricFocus}
            metricId={this.props.metricId}
            onSubmit={this.props.onChangeGuesstimate}
            ref='form'
        />
    </div>
    )
  }
};

