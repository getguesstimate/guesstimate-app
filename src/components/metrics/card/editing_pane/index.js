import React, {Component, PropTypes} from 'react'
import ReactCSSTransitionGroup from 'react/lib/ReactCSSTransitionGroup';
import GuesstimateForm from './guesstimate_form';
import ShowIf from 'gComponents/utility/showIf';
import './style.css'

@ShowIf
export default class MetricEditingPane extends Component {
  static propTypes = {
    guesstimate: PropTypes.object.isRequired,
    guesstimateForm: PropTypes.object.isRequired,
    metricId: PropTypes.string.isRequired,
    onChangeGuesstimate: PropTypes.func,
  }
  _handlePress(e) {
    e.stopPropagation()
  }
  render() {
    let items = (
      <div className='metric-container editing-section' key={this.props.metricId}>
        <div className='row'>
          <div
              className='col-xs-12'
              onKeyDown={this._handlePress}
          >
          <GuesstimateForm
              guesstimate={this.props.guesstimate}
              guesstimateForm={this.props.guesstimateForm}
              metricId={this.props.metricId}
              onSubmit={this.props.onChangeGuesstimate}
              value={this.props.guesstimate.input}
              metricFocus={this.props.metricFocus}
          />
          </div>
        </div>
        </div>
      )
    return (
      <ReactCSSTransitionGroup
          transitionName='drop'
          transitionAppear={true}
          transitionAppearTimeout={500}
          transitionEnterTimeout={300}
          transitionLeaveTimeout={300}
      >
      {items}
      </ReactCSSTransitionGroup>
    )
  }
};

