import React, {Component, PropTypes} from 'react';
import { connect } from 'react-redux';
import { createDistributionForm, destroyDistributionForm, updateDistributionForm } from '../../actions/distribution-form-actions'

//this.props.dispatch(removeMetric(this.props.item.id))
//
class DistributionForm extends Component{
  constructor(props) {
    super(props);
    this.state = {userInput: this.props.value || ''};
  }
  _handleFocus() {
    this.props.dispatch(createDistributionForm(this._value()))
  }
  _handleBlur() {
    this.props.dispatch(destroyDistributionForm('what'))
    this.props.onSubmit({value: this._value(), distribution: this.props.distributionForm.distribution})
  }
  _handleChange() {
    this.setState({userInput: this._value()});
    this.props.dispatch(updateDistributionForm(this._value()))
  }
  _value() {
    return React.findDOMNode(this.refs.input).value
  }
  render() {
    return(
    <input type="text"
    ref='input'
    value={this.state.userInput}
    onFocus={this._handleFocus.bind(this)}
    onBlur={this._handleBlur.bind(this)}
    onChange={this._handleChange.bind(this)}
    />
    )
  }
}

function select(state) {
  return {
    distributionForm: state.distributionForm
  }
}

module.exports = connect(select)(DistributionForm);
