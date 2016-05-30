import React, {Component, PropTypes} from 'react'

import GuesstimateTypeIcon from './GuesstimateTypeIcon'
import TextInput from './TextInput'
import DistributionSelector from './DistributionSelector'

import {Guesstimator} from 'lib/guesstimator/index'

export default class TextForm extends Component{
  displayName: 'GuesstimateInputForm'

  state = { showDistributionSelector: false }

  static propTypes = {
    onChange: PropTypes.func,
    onSave: PropTypes.func,
    onAddDefaultData: PropTypes.func,
    onChangeClickMode: PropTypes.func,
    guesstimate: PropTypes.object,
    size: PropTypes.string
  }

  focus() { this.refs.TextInput.focus() }

  _guesstimateType() {
    return Guesstimator.parse(this.props.guesstimate)[1].samplerType()
  }

  _handleChange(params) {
    this.props.onChange(params)
    this.setState({showDistributionSelector: false})
  }

  componentDidUpdate(newProps) {
    const sameMetric = (newProps.guesstimate.metric === this.props.guesstimate.metric)
    const sameInput = (newProps.guesstimate.input === this.props.guesstimate.input)
    if (sameMetric && !sameInput){
      this._switchMetricClickMode(true)
    }
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

  _saveData(data) { this.props.onSave({guesstimateType: 'DATA', data, input: null}) }

  _shouldDisplayType() {
    const type = this._guesstimateType()
    return !(type.referenceName === 'POINT' || type.referenceName === 'FUNCTION')
  }

  //onChangeData should be removed to Guesstimator lib.
  _textInput() {
    const {guesstimate, onEscape, size, hasErrors} = this.props
    let {showDistributionSelector} = this.state
    const {input} = guesstimate
    const guesstimateType = this._guesstimateType()
    const shouldDisplayType = !(guesstimateType.referenceName === 'POINT' || guesstimateType.referenceName === 'FUNCTION')
    const shouldBeWide = !(guesstimateType.referenceName === 'FUNCTION')

    return(
      <div className='GuesstimateInputForm'>
        <div className='GuesstimateInputForm--row'>
          <TextInput
            value={input}
            onEscape={onEscape}
            onChange={(input) => this._handleChange({input})}
            onFocus={() => {this._switchMetricClickMode.bind(this)(true)}}
            onBlur={this._handleBlur.bind(this)}
            onChangeData={this._saveData.bind(this)}
            ref='TextInput'
            hasErrors={hasErrors}
            width={shouldBeWide ? 'NARROW' : "WIDE"}
          />

          { shouldDisplayType &&
            <GuesstimateTypeIcon
              guesstimateType={guesstimateType}
              toggleDistributionSelector={() => this.setState({showDistributionSelector: !showDistributionSelector})}
            />
          }
        </div>

        {showDistributionSelector &&
          <div className='GuesstimateInputForm--row'>
            <DistributionSelector
              onSubmit={(guesstimateType) => this._handleChange({guesstimateType})}
              selected={guesstimateType}
            />
          </div>
        }
      </div>
    )
  }
  //right now errors live in the simulation, which is not present here.
  render() {
    const {size, guesstimate} = this.props
    const hasEmptyInput = _.isEmpty(guesstimate.input)
    const isLarge = (size === 'large')
    if (!isLarge) { return( this._textInput() ) }
    else {
      return(
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
      )
    }
  }
}
