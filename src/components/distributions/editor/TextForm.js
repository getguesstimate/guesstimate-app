import React, {Component, PropTypes} from 'react';
import GuesstimateTypeIcon from './guesstimate-type-icon.js'
import {Guesstimator} from 'lib/guesstimator/index.js'
import TextInput from './text-input.js'
import DistributionSelector from './distribution-selector.js'

export default class TextForm extends Component{
  displayName: 'GuesstimateInputForm'

  state = {
    showDistributionSelector: false
  }

  static propTypes = {
    onChange: PropTypes.func,
    onSave: PropTypes.func,
    onAddDefaultData: PropTypes.func,
    onChangeClickMode: PropTypes.func,
    guesstimateForm: PropTypes.object,
    size: PropTypes.string
  }

  componentWillMount() {
    this._handleChange = _.throttle(this._handleChange, 300)
  }

  focus() {
    this.refs.TextInput.focus()
  }

  _guesstimateType() {
    return Guesstimator.parse(this.props.guesstimateForm)[1].samplerType()
  }

  _handleChange(params) {
    this.props.onChange(params)
    this.setState({showDistributionSelector: false})
  }

  _changeDistributionType(guesstimateType) {
    this._handleChange({guesstimateType})
  }

  componentDidUpdate(newProps) {
    const sameMetric = (newProps.guesstimateForm.metric === this.props.guesstimateForm.metric)
    const sameInput = (newProps.guesstimateForm.input === this.props.guesstimateForm.input)
    if (sameMetric && !sameInput){
      this._switchMetricClickMode(true)
    }
  }

  _changeInput(input) {
    this._handleChange({input})
  }

  _handleBlur() {
    this._switchMetricClickMode(false)
    this.props.onSave()
  }

  _switchMetricClickMode(inClick=true) {
    const isFunction = (inClick && (this._guesstimateType().referenceName === 'FUNCTION'))
    const newMode = isFunction ? 'FUNCTION_INPUT_SELECT' : ''
    this.props.onChangeClickMode(newMode)
  }

  _saveData(data) {
    this.props.onSave({guesstimateType: 'DATA', data, input: null})
  }

  _textInput() {
    const {guesstimateForm, metricFocus, size} = this.props
    let {showDistributionSelector} = this.state
    const {input} = guesstimateForm
    const guesstimateType = this._guesstimateType()
    return(
      <div>
        <div className='row'>
          <div className='col-sm-12'>
            <TextInput
              value={input}
              metricFocus={metricFocus}
              onChange={this._changeInput.bind(this)}
              onFocus={() => {this._switchMetricClickMode.bind(this)(true)}}
              onBlur={this._handleBlur.bind(this)}
              onChangeData={this._saveData.bind(this)}
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
      </div>
    )
  }
  //right now errors live in the simulation, which is not present here.
  render() {
    const {size, guesstimateForm} = this.props
    const hasEmptyInput = _.isEmpty(guesstimateForm.input)
    const isLarge = (size === 'large')
    return (
     <div>
        {!isLarge && this._textInput()}
        {isLarge &&
          <div className='row'>
            <div className='col-sm-8'>
              {this._textInput()}
            </div>
            <div className='col-sm-4'>
              {hasEmptyInput &&
                <a className='custom-data' onClick={this.props.onAddDefaultData}>
                  Add Custom Data
                </a>
              }
            </div>
          </div>
        }
      </div>)

  }
}
