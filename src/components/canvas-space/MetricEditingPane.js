import React, {Component, PropTypes} from 'react'
import ReactCSSTransitionGroup from 'react/lib/ReactCSSTransitionGroup';
import GuesstimateForm from './guesstimate-form';
import ShowIf from '../utility/showIf';

@ShowIf
export default class MetricEditingPane extends Component {
  static propTypes = {
    guesstimate: PropTypes.object.isRequired,
    guesstimateForm: PropTypes.object.isRequired,
    onChangeGuesstimate: PropTypes.func
  }
  _handlePress(e) {
    e.stopPropagation()
  }
  render() {
    return (
      <ReactCSSTransitionGroup
          transitionEnterTimeout={500}
          transitionName='carousel'
      >
        <div className='editing-section'>
          <div className='row'>
            <div
                className='col-xs-12'
                onKeyDown={this._handlePress}
            >
            <GuesstimateForm
                guesstimate={this.props.guesstimate}
                guesstimateForm={this.props.guesstimateForm}
                onSubmit={this.props.onChangeGuesstimate}
                value={this.props.guesstimate.input}
            />
            </div>
          </div>
        </div>
      </ReactCSSTransitionGroup>
    )
  }
};

