import React, {Component, PropTypes} from 'react';
import ReactDOM from 'react-dom'
import { connect } from 'react-redux';
import { createGuesstimateForm, destroyGuesstimateForm, changeGuesstimateForm} from 'gModules/guesstimate_form/actions'
import $ from 'jquery'
import Icon from 'react-fa'
import insertAtCaret from 'lib/jquery/insertAtCaret'
import DistributionSelector from './distribution-selector.js'
import Image from 'assets/distribution-icons/normal.png'

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

  state = {
    userInput: this.props.value || '',
    guesstimateType: 'UNIFORM',
    showDistributionSelector: false
  }

  componentWillUnmount() {
    $(window).off('functionMetricClicked')
    this.props.dispatch(destroyGuesstimateForm());
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
    $(window).off('functionMetricClicked')
  }
  _handlePress(event) {
    let value = event.target.value;
    this._changeInput(value);
    event.stopPropagation()
  }
  _changeInput(userInput=this._value()){
    this.setState({userInput}, () => {this._dispatchChange()})
  }
  _dispatchChange() {
    const {userInput, guesstimateType} = this.state;
    const {metricId} = this.props;
    this.props.dispatch(changeGuesstimateForm({
      input: userInput,
      metric: metricId,
      guesstimateType
    }));
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
  _changeDistributionType(guesstimateType) {
    this.setState({guesstimateType}, () => {this._dispatchChange()})
  }
  //right now errors live in the simulation, which is not present here.
  render() {
    let distribution = this.props.guesstimateForm && this.props.guesstimateForm.distribution;
    let errors = distribution && distribution.errors;
    let errorPane = <div className='errors'>{errors} </div>
    const {showDistributionSelector} = this.state
    return(
      <div className='GuesstimateForm'>
        <div className='row'>
          <div className='col-sm-12'>
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
            <div
                  className='ui button tinyhover-toggle DistributionSelectorToggle DistributionIcon'
                  onMouseDown={() => {this.setState({showDistributionSelector: !showDistributionSelector})}}
            >
              {!showDistributionSelector && <img src={Image}/>}
              {showDistributionSelector && <Icon name='caret-down'/>}
            </div>
          </div>
        </div>
        {showDistributionSelector &&
          <div className='row'>
            <div className='col-sm-12'>
              <DistributionSelector onSubmit={this._changeDistributionType.bind(this)}/>
            </div>
          </div>
        }
      </div>)
  }
}

module.exports = connect(null, null, null, {withRef: true})(GuesstimateForm);
