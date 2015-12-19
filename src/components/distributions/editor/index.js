import React, {Component, PropTypes} from 'react';
import ReactDOM from 'react-dom'
import { connect } from 'react-redux';
import { createGuesstimateForm, changeGuesstimateForm, saveGuesstimateForm} from 'gModules/guesstimate_form/actions'
import { changeMetricClickMode } from 'gModules/canvas_state/actions'
import $ from 'jquery'
import Icon from 'react-fa'
import DistributionSelector from './distribution-selector.js'
import * as guesstimator from 'lib/guesstimator/index.js'
import TextInput from './text-input.js'
import './style.css'
import * as elev from 'server/elev/index.js'

class GuesstimateForm extends Component{
  displayName: 'GuesstimateForm'

  componentWillMount() {
    this._dispatchChange = _.throttle(this._dispatchChange, 300)
  }

  static propTypes = {
    dispatch: PropTypes.func,
    guesstimateForm: PropTypes.object.isRequired,
    metricId: PropTypes.string.isRequired,
    metricFocus: PropTypes.func.isRequired,
    onSubmit: PropTypes.func,
    size: PropTypes.bool
  }

  state = {
    showDistributionSelector: false
  }

  componentWillMount() {
    this.props.dispatch(createGuesstimateForm(this.props.metricId))
  }

  focus() {
    this.refs.TextInput.focus()
  }

  _guesstimateTypeName() {
    return this.props.guesstimateForm.guesstimateType
  }

  _guesstimateType() {
    return guesstimator.find(this._guesstimateTypeName())
  }

  _dispatchChange(params) {
    this.props.dispatch(changeGuesstimateForm(params));
    const {isRangeDistribution} = this._guesstimateType()
    if (this.state.showDistributionSelector && !isRangeDistribution){
      this.setState({showDistributionSelector: false})
    }
  }

  _changeDistributionType(guesstimateType) {
    this._dispatchChange({guesstimateType})
    this.setState({showDistributionSelector: false})
  }

  componentDidUpdate(newProps) {
    const sameMetric = (newProps.guesstimateForm.metric === this.props.guesstimateForm.metric)
    const sameInput = (newProps.guesstimateForm.input === this.props.guesstimateForm.input)
    if (sameMetric && !sameInput){
      this._switchMetricClickMode()
    }
  }

  _changeInput(input) {
    this._dispatchChange({input: input})
  }

  _switchMetricClickMode(inClick=true) {
    if (inClick && (this._guesstimateTypeName() === 'FUNCTION')){
      this.props.dispatch(changeMetricClickMode('FUNCTION_INPUT_SELECT'));
    } else {
      this.props.dispatch(changeMetricClickMode(''));
    }
  }

  //right now errors live in the simulation, which is not present here.
  render() {
    let {showDistributionSelector} = this.state
    const {guesstimateForm, metricFocus} = this.props
    const {input} = guesstimateForm
    const guesstimateType = this._guesstimateType()

    let formClasses = 'GuesstimateForm'
    formClasses += (this.props.size === 'large') ? ' large' : ''
    return(
      <div className={formClasses}>
        <div className='row'>
          <div className='col-sm-12'>
            <TextInput
              value={input}
              metricFocus={metricFocus}
              onChange={this._changeInput.bind(this)}
              onFocus={() => {this._switchMetricClickMode.bind(this)(true)}}
              onBlur={() => {this._switchMetricClickMode.bind(this)(false)}}
              ref='TextInput'
            />
            <GuesstimateTypeIcon
              guesstimateType={guesstimateType}
              toggleDistributionSelector={() => {this.setState({showDistributionSelector: !showDistributionSelector})}}
            />
          </div>
        </div>
        {showDistributionSelector &&
          <div className='row'>
            <div className='col-sm-12'>
              <DistributionSelector
                onSubmit={this._changeDistributionType.bind(this)}
                selected={guesstimateType}
              />
            </div>
          </div>
        }
      </div>)
  }
}

class GuesstimateTypeIcon extends Component{
  displayName: 'GuesstimateTypeIcon'

  _handleShowInfo() {
    elev.open(elev.GUESSTIMATE_TYPES)
  }

  _handleMouseDown() {
    if (this.props.guesstimateType.isRangeDistribution){
      this.props.toggleDistributionSelector()
    }
  }

  render() {
    const {guesstimateType} = this.props
    if (!guesstimateType){ return (false) }
    const {isRangeDistribution, icon} = guesstimateType
    const showIcon = guesstimateType && guesstimateType.icon

    let className='DistributionSelectorToggle DistributionIcon'
    className += isRangeDistribution ? ' button' : ''
    if (showIcon) {
      return(
        <div
            className={className}
            onMouseDown={this._handleMouseDown.bind(this)}
        >
          <img src={icon}/>
        </div>
      )
    } else {
      return (
        <div className='GuesstimateTypeQuestion' onMouseDown={this._handleShowInfo.bind(this)}>
          <Icon name='question-circle'/>
        </div>
      )
    }
  }
}

module.exports = connect(null, null, null, {withRef: true})(GuesstimateForm);
