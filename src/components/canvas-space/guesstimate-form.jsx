import React, {Component, PropTypes} from 'react';
import ReactDOM from 'react-dom'
import { connect } from 'react-redux';
import { createGuesstimateForm, destroyGuesstimateForm, updateGuesstimateForm, addMetricInputToGuesstimateForm } from '../../actions/guesstimate-form-actions'
import $ from 'jquery'

class GuesstimateForm extends React.Component{
  constructor(props) {
    super(props);
    this.state = {userInput: this.props.value || ''};
  }
  componentWillUnmount() {
    this._handleBlur()
  }
  _handleMetricClick(item){
    let newInput = this.state.userInput + item.readableId
    this.setState({userInput: newInput})
  }
  _handleFocus() {
    $(window).on('functionMetricClicked', (a, item) => {this._handleMetricClick(item)})
    this.props.dispatch(createGuesstimateForm(this._value()))
  }
  _handleBlur() {
    $(window).off('functionMetricClicked')
    this.props.dispatch(destroyGuesstimateForm());
    this.props.onSubmit(this._value());
  }
  _handlePress(event) {
    let value = event.target.value;
    this.setState({userInput: value});
    this.props.dispatch(updateGuesstimateForm(value));
  }
  _value() {
    return ReactDOM.findDOMNode(this.refs.input).value
  }
  render() {
    let mean = _.get(this.props, 'guesstimateForm.distribution.mean')
    return(
      <div>
    <input type="text"
      ref='input'
      placeholder={'value'}
      value={this.state.userInput}
      onBlur={this._handleBlur.bind(this)}
      onFocus={this._handleFocus.bind(this)}
      onChange={this._handlePress.bind(this)}
    />
    {mean}
    </div>
    )
  }
}

function select(state) {
  return {
    guesstimateForm: state.guesstimateForm
  }
}

module.exports = connect(select)(GuesstimateForm);
