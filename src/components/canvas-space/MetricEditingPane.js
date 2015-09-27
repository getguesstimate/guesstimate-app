import React, {Component, PropTypes, addons} from 'react'
import ReactCSSTransitionGroup from 'react/lib/ReactCSSTransitionGroup';
import GuesstimateForm from './guesstimate-form';
import ShowIf from '../utility/showIf';

@ShowIf
export default class MetricEditingPane extends Component {
  static propTypes = {
    value: React.PropTypes.string.isRequired,
    guesstimate: React.PropTypes.object.isRequired,
    guesstimateForm: React.PropTypes.object.isRequired,
    onChangeGuesstimate: React.PropTypes.funct
  }
  _handlePress(e) {
    e.stopPropagation()
  }
  render() {
    return (
      <ReactCSSTransitionGroup transitionEnterTimeout={500} transitionName='carousel' transitionAppear={true}>
        <div className='editing-section'>
          <div className='row'>
            <div onKeyDown={this._handlePress} className='col-xs-12'>
              <GuesstimateForm
              value={this.props.guesstimate.input}
              guesstimate={this.props.guesstimate}
              guesstimateForm={this.props.guesstimateForm}
              onSubmit={this.props.onChangeGuesstimate}/>
            </div>
          </div>
        </div>
      </ReactCSSTransitionGroup>
    )
  }
};

