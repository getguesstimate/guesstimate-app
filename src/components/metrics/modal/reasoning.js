import React, {Component, PropTypes} from 'react'
import Modal from 'react-modal'
import ClickToEdit from 'gComponents/utility/click-to-edit/index.js'
import ReactMarkdown from 'react-markdown'
import style from './reasoning.css'
import Icon from 'react-fa'

export default class ReasoningEditor extends Component {
  render() {
    return (
      <textarea value={'this is interesting'}/>
    )
  }
}

export default class ReasoningViewer extends Component {
  render() {
    return(
      <div className='reasoningViewer'>
        <ReactMarkdown source={this.props.value}/>
      </div>
    )
  }
}

export default class Reasoning extends Component {
  render() {
    const {value} = this.props
    return (
      <div className='Reasoning'>
        <ClickToEdit
          viewing={<ReasoningViewer value={value}/>}
          emptyValue={<span className='emptyValue'><Icon name='align-left'/>Describe your reasoning...</span>}
          editingSaveText={'Save'}
          onSubmit={this.props.onChange}
          value={value}
        />
      </div>
    )
  }
}
