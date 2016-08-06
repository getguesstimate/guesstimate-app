import React, {Component, PropTypes} from 'react'

import {GuesstimateTypeIcon} from './GuesstimateTypeIcon'
import {TextInput} from './TextInput'
import DistributionSelector from './DistributionSelector'

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
    onFocus: PropTypes.func,
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
    this.props.onFocus()
  }

  _handleBlur() {
    this.props.onChangeClickMode('')
    this.props.onSave()
  }

  //onChangeData should be removed to Guesstimator lib.
  _textInput() {
    const {
      guesstimate: {input, guesstimateType},
      inputMetrics,
      onEscape,
      size,
      errors,
      organizationId,
      organizationHasFacts,
      onChangeInput,
      onAddData,
      onChangeGuesstimateType,
      onReturn,
      onTab
    } = this.props
    const {showDistributionSelector} = this.state
    const shouldDisplayType = !(guesstimateType === 'POINT' || guesstimateType === 'FUNCTION')
    const shouldBeWide = !(guesstimateType === 'FUNCTION')
    const validInputReadableIds = inputMetrics.filter(
      m => !_.get(m, 'simulation.sample.errors.length') && !!_.get(m, 'simulation.sample.values.length')
    ).map(m => m.readableId)
    const errorInputReadableIds = inputMetrics.filter(
      m => !!_.get(m, 'simulation.sample.errors.length') || !_.get(m, 'simulation.sample.values.length')
    ).map(m => m.readableId)

    return(
      <div className='GuesstimateInputForm'>
        <div className='GuesstimateInputForm--row'>
          <TextInput
            value={input}
            validInputs={validInputReadableIds}
            errorInputs={errorInputReadableIds}
            onEscape={onEscape}
            onReturn={onReturn}
            onTab={onTab}
            onChange={this.onChangeInput.bind(this)}
            onFocus={this._switchMetricClickMode.bind(this)}
            onBlur={this._handleBlur.bind(this)}
            onChangeData={onAddData}
            ref='TextInput'
            errors={errors}
            width={shouldBeWide ? 'NARROW' : "WIDE"}
            organizationId={organizationId}
            organizationHasFacts={organizationHasFacts}
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
