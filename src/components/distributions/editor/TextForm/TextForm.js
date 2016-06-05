import React, {Component, PropTypes} from 'react'

import {GuesstimateTypeIcon} from './GuesstimateTypeIcon'
import TextInput from './TextInput'
import DistributionSelector from './DistributionSelector'

import {Guesstimator} from 'lib/guesstimator/index'

export class TextForm extends Component{
  displayName: 'GuesstimateInputForm'

  state = { showDistributionSelector: false }

  static propTypes = {
    onChangeInput: PropTypes.func.isRequired,
    onAddData: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
    onChangeGuesstimateType: PropTypes.func.isRequired,
    onAddDefaultData: PropTypes.func,
    onChangeClickMode: PropTypes.func,
    guesstimate: PropTypes.object,
    size: PropTypes.string
  }

  focus() { this.refs.TextInput.focus() }

  onChangeInput(input) {
    this.props.onChangeInput(input)
    this.setState({showDistributionSelector: false})
  }

  _switchMetricClickMode() {
    if (this.props.guesstimate.guesstimateType === 'FUNCTION') {this.props.onChangeClickMode('FUNCTION_INPUT_SELECT')}
  }

  _handleBlur() {
    this.props.onChangeClickMode('')
    this.props.onSave()
  }

  //onChangeData should be removed to Guesstimator lib.
  _textInput() {
    const {
      guesstimate: {input, guesstimateType},
      onEscape,
      size,
      hasErrors,
      onChangeInput,
      onAddData,
      onChangeGuesstimateType
    } = this.props
    const {showDistributionSelector} = this.state
    const shouldDisplayType = !(guesstimateType === 'POINT' || guesstimateType === 'FUNCTION')
    console.log('shouldDisplayType', shouldDisplayType, guesstimateType)
    const shouldBeWide = !(guesstimateType === 'FUNCTION')

    return(
      <div className='GuesstimateInputForm'>
        <div className='GuesstimateInputForm--row'>
          <TextInput
            value={input}
            onEscape={onEscape}
            onChange={this.onChangeInput.bind(this)}
            onFocus={this._switchMetricClickMode.bind(this)}
            onBlur={this._handleBlur.bind(this)}
            onChangeData={onAddData}
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
              onSubmit={onChangeGuesstimateType}
              selected={guesstimateType}
            />
          </div>
        }
      </div>
    )
  }
  //right now errors live in the simulation, which is not present here.
  render() {
    const {size, guesstimate: {input}} = this.props
    if (size !== 'large') {
      return( this._textInput() )
    }

    return(
      <div className='row'>
        <div className='col-sm-8'>
          {this._textInput()}
        </div>
        <div className='col-sm-4'>
          {_.isEmpty(input) &&
            <a className='custom-data' onClick={this.props.onAddDefaultData}>
              Add Custom Data
            </a>
          }
        </div>
      </div>
    )
  }
}
