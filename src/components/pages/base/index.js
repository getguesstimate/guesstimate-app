import React, {Component, PropTypes} from 'react'
import ReactMarkdown from 'react-markdown'
import './style.css'

export default class PageBase extends Component{
  displayName: 'PageBase'
  render () {
    return (
      <div className='PageBase'>
        <ReactMarkdown source={this.props.content}/>
        <br/>
        <br/>
      </div>
    )
  }
}
