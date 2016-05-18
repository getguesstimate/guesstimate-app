import React, {Component, PropTypes} from 'react';

import ReactDOM from 'react-dom'
import $ from 'jquery'
import TextArea from 'react-textarea-autosize'

import DistributionSelector from './DistributionSelector'

import insertAtCaret from 'lib/jquery/insertAtCaret'

export default class TextInput extends Component{
  displayName: 'GuesstimateForm-TextInput'

  static propTypes = { value: PropTypes.string }

  componentWillUnmount() { this._handleBlur() }

  focus() { this.refs.input.select() }

  _handleInputMetricClick(item){
    insertAtCaret('live-input', item.readableId)
    this._changeInput();
  }

  _handleFocus() {
    $(window).on('functionMetricClicked', (a, item) => {this._handleInputMetricClick(item)})
    this.props.onFocus()
  }

  _handleBlur() {
    $(window).off('functionMetricClicked')
    this.props.onBlur()
  }

  _handlePress(event) {
    let value = event.target.value;
    if (this._isData(value)) {
      const data = this._formatData(value)
      this.props.onChangeData(data)
    } else {
      this._changeInput();
    }
    event.stopPropagation()
  }

  _changeInput(value=this._value()){ this.props.onChange(value) }
  _value() { return ReactDOM.findDOMNode(this.refs.input).value }

  _formatData(value) {
    return value
          .replace(/[\[\]]/g, '')
          .split(/[\n\s,]+/)
          .filter(e => !_.isEmpty(e))
          .map(Number)
          .filter(e => _.isFinite(e))
          .slice(0, 10000)
  }

  //TODO: It would be nice to eventually refactor this to use guesstimator lib
  _isData(input) {
    const isFunction = input.includes('=')
    const count = (input.match(/[\n\s,]/g) || []).length
    return !isFunction && (count > 3)
  }

  _handleKeyDown(e) {
    if (e.which === 27 || e.which === 13) {
      e.preventDefault()
      this.props.onEscape()
    }
  }

  render() {
   const {hasErrors, width} = this.props
   let className = (this.props.value !== '' && hasErrors) ? 'hasErrors' : ''
   className += ` ${width}`
   return(
     <TextArea
         id="live-input"
         onBlur={this._handleBlur.bind(this)}
         onChange={this._handlePress.bind(this)}
         onFocus={this._handleFocus.bind(this)}
         onKeyDown={this._handleKeyDown.bind(this)}
         placeholder={'value'}
         ref='input'
         type="text"
         className={className}
         value={this.props.value}
         tabIndex={2}
     />
   )
  }
}
