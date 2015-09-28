import React, {Component, PropTypes} from 'react';
import ReactDOM from 'react-dom'
import { connect } from 'react-redux';
import { createGuesstimateForm, destroyGuesstimateForm, changeGuesstimateForm} from '../../actions/guesstimate-form-actions'
import $ from 'jquery'
import insertAtCaret from '../../lib/jquery/insertAtCaret'

class GuesstimateForm extends Component{
  displayName: 'GuesstimateForm'

  static propTypes = {
    dispatch: PropTypes.func,
    guesstimate: PropTypes.object.isRequired,
    guesstimateForm: PropTypes.object.isRequired,
    metricId: PropTypes.string.isRequired,
    onSubmit: PropTypes.func,
    value: PropTypes.string
  }

  state = {userInput: this.props.value || ''}

  componentWillUnmount() {
    this._submit()
  }
  _handleMetricClick(item){
    insertAtCaret('live-input', item.readableId)
    this._changeInput();
  }
  _handleFocus() {
    $(window).on('functionMetricClicked', (a, item) => {this._handleMetricClick(item)})
    this.props.dispatch(createGuesstimateForm(this._value()))
  }
  _handleBlur() {
    this._submit()
  }
  _submit() {
    $(window).off('functionMetricClicked')
    this.props.dispatch(destroyGuesstimateForm());
    if (this.props.value !== this.state.userInput){
      this.props.onSubmit(this.props.guesstimateForm);
    }
  }
  _handlePress(event) {
    let value = event.target.value;
    this._changeInput(value);
  }
  _changeInput(value=this._value()){
    this.setState({userInput: value});
    this.props.dispatch(changeGuesstimateForm(value, this.props.metricId));
  }
  _value() {
    return ReactDOM.findDOMNode(this.refs.input).value
  }
  _handleKeyDown(e) {
    if ((e.which > 96) && (e.which < 123)){
      e.preventDefault()
    }
  }
  render() {
    let distribution = this.props.guesstimateForm && this.props.guesstimateForm.distribution;
    let errors = distribution && distribution.errors;
    let errorPane = <div className='errors'>{errors} </div>
    return(
      <div className='guesstimate-form'>
        <input
            id="live-input"
            onBlur={this._handleBlur.bind(this)}
            onChange={this._handlePress.bind(this)}
            onFocus={this._handleFocus.bind(this)}
            onKeyPress={this._handleKeyDown}
            placeholder={'value'}
            ref='input'
            type="text"
            value={this.state.userInput}
        />
        {errors ? errorPane : ''}
      </div>)
  }
}

module.exports = connect()(GuesstimateForm);
