import React, {Component, PropTypes} from 'react';
import ReactDOM from 'react-dom'
import { connect } from 'react-redux';
import { createGuesstimateForm, destroyGuesstimateForm, updateGuesstimateForm, changeGuesstimateForm, addMetricInputToGuesstimateForm } from '../../actions/guesstimate-form-actions'
import DistributionSummary from './distribution-summary'
import $ from 'jquery'
import _ from 'lodash'
import Icon from'react-fa'

function insertAtCaret(areaId,text) {
    var txtarea = document.getElementById(areaId);
    var scrollPos = txtarea.scrollTop;
    var strPos = 0;
    var br = ((txtarea.selectionStart || txtarea.selectionStart == '0') ?
        "ff" : (document.selection ? "ie" : false ) );
    if (br == "ie") {
        txtarea.focus();
        var range = document.selection.createRange();
        range.moveStart ('character', -txtarea.value.length);
        strPos = range.text.length;
    }
    else if (br == "ff") strPos = txtarea.selectionStart;

    var front = (txtarea.value).substring(0,strPos);
    var back = (txtarea.value).substring(strPos,txtarea.value.length);
    txtarea.value=front+text+back;
    strPos = strPos + text.length;
    if (br == "ie") {
        txtarea.focus();
        var range = document.selection.createRange();
        range.moveStart ('character', -txtarea.value.length);
        range.moveStart ('character', strPos);
        range.moveEnd ('character', 0);
        range.select();
    }
    else if (br == "ff") {
        txtarea.selectionStart = strPos;
        txtarea.selectionEnd = strPos;
        txtarea.focus();
    }
    txtarea.scrollTop = scrollPos;
}

class GuesstimateForm extends React.Component{
  constructor(props) {
    super(props);
    this.state = {userInput: this.props.value || ''};
  }
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
    this.props.dispatch(changeGuesstimateForm(value));
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
        <input type="text"
          id="live-input"
          ref='input'
          placeholder={'value'}
          onKeyPress={this._handleKeyDown}
          value={this.state.userInput}
          onBlur={this._handleBlur.bind(this)}
          onFocus={this._handleFocus.bind(this)}
          onChange={this._handlePress.bind(this)}
        />
        {errors ? errorPane : ''}
      </div>)
  }
}

module.exports = connect()(GuesstimateForm);
