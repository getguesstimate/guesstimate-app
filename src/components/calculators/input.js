import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'

import {EditorState, Editor, ContentState} from 'draft-js'

import {changeGuesstimate} from 'gModules/guesstimates/actions'

import {Guesstimator} from 'lib/guesstimator/index'

@connect(null, dispatch => bindActionCreators({changeGuesstimate: changeGuesstimate}, dispatch))
export class Input extends Component{
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
    return (
      <div className='input row'>
        <div className='name col-md-7'>{this.props.name}</div>
        <div className='editor col-md-5'>
          <Editor
            editorState={this.state.editorState}
            onChange={this.changeInput.bind(this)}
          />
        </div>
      </div>
    )
  }
}
