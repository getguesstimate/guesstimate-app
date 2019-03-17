import React, {Component} from 'react' 
import PropTypes from 'prop-types'
import ReactMarkdown from 'react-markdown'
import Container from 'gComponents/utility/container/Container.js'
import './style.css'

export default class PageBase extends Component{
  displayName: 'PageBase'
  render () {
    return (
      <Container>
        <div className='PageBase'>
          <ReactMarkdown source={this.props.content}/>
        </div>
    </Container>
    )
  }
}
