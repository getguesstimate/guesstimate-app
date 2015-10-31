import React, {Component, PropTypes} from 'react';
import ReactDOM from 'react-dom'
import { connect } from 'react-redux';
import { createGuesstimateForm, destroyGuesstimateForm, changeGuesstimateForm} from 'gModules/guesstimate_form/actions'
import $ from 'jquery'
import insertAtCaret from 'lib/jquery/insertAtCaret'

class GuesstimateForm extends Component{
  displayName: 'GuesstimateForm'

  componentWillMount() {
    this._dispatchChange = _.throttle(this._dispatchChange, 300)
  }

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
    this.props.dispatch(createGuesstimateForm({input: this._value(), metric: this.props.metricId}))
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
    this._dispatchChange(value)
  }
  _dispatchChange(value) {
    this.props.dispatch(changeGuesstimateForm({input: value, metric: this.props.metricId}));
  }
  _value() {
    return ReactDOM.findDOMNode(this.refs.input).value
  }
  _handleKeyUp(e) {
    if (e.which === 27 || e.which === 13) {
      e.preventDefault()
      this.props.metricFocus()
    }
  }
  render() {
    let distribution = this.props.guesstimateForm && this.props.guesstimateForm.distribution;
    let errors = distribution && distribution.errors;
    let errorPane = <div className='errors'>{errors} </div>
    return(
      <div className='GuesstimateForm'>
        <input
            id="live-input"
            onBlur={this._handleBlur.bind(this)}
            onChange={this._handlePress.bind(this)}
            onFocus={this._handleFocus.bind(this)}
            onKeyUp={this._handleKeyUp.bind(this)}
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
