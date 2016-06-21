import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'

import {EditorState, Editor, ContentState} from 'draft-js'

import {changeGuesstimate} from 'gModules/guesstimates/actions'

import {Guesstimator} from 'lib/guesstimator/index'

import './style.css'

@connect(null, dispatch => bindActionCreators({changeGuesstimate: changeGuesstimate}, dispatch))
export class CalculatorGuesstimateForm extends Component{
  displayName: 'Guesstimate'
  static propTypes = {
    dispatch: PropTypes.func,
    guesstimate: PropTypes.object,
    metricId: PropTypes.string.isRequired,
  }

  state = {
    editorState: EditorState.createWithContent(ContentState.createFromText(this.props.guesstimate.input || ''))
  }

  changeInput(editorState) {
    const {guesstimate, metricId} = this.props

    const input = editorState.getCurrentContent().getPlainText('')
    const guesstimateType = Guesstimator.parse({...guesstimate, input})[1].samplerType().referenceName

    this.props.changeGuesstimate(
      metricId,
      {...guesstimate, ...{data: null, input, guesstimateType}},
      true,
      false
    )

    return this.setState({editorState})
  }

  render () {
    if(this.props.guesstimate.metric !== this.props.metricId) { return false }

    return (
      <div className={'Guesstimate'}>
        <div className='GuesstimateInputForm'>
          <div className='GuesstimateInputForm--row'>
            <span className={`TextInput${_.isEmpty(this.props.errors) ? '' : ' hasErrors'}`}>
              <Editor
                editorState={this.state.editorState}
                onChange={this.changeInput.bind(this)}
              />
            </span>
          </div>
        </div>
      </div>
    )
  }
}
