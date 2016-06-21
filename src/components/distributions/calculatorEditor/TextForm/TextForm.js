import React, {Component, PropTypes} from 'react'

import TextInput from './TextInput'

export class TextForm extends Component{
  _handleBlur() {
    this.props.onSave()
  }

  render() {
    const {
      guesstimate: {input, guesstimateType},
      size,
      hasErrors,
      onChangeInput,
    } = this.props

    return(
      <div className='GuesstimateInputForm'>
        <div className='GuesstimateInputForm--row'>
          <TextInput
            value={input}
            onChange={onChangeInput}
            onBlur={this._handleBlur.bind(this)}
            ref='TextInput'
            hasErrors={hasErrors}
          />
        </div>
      </div>
    )
  }
}
