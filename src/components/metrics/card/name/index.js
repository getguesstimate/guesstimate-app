import React, {Component, PropTypes} from 'react';
import TextArea from 'react-textarea-autosize';
import ReactDOM from 'react-dom'
import _ from 'lodash'
import './style.css'

class MetricForm extends Component {
  componentDidMount() {
    let nameField = ReactDOM.findDOMNode(this.refs.nameField)
    _.delay(e => {
      nameField.focus()
      nameField.setSelectionRange(1000, 1000);
    }, 5)
  }

  handleSubmit() {
    this.props.handleSubmit({name: this.refs.nameField.value})
  }

  render() {
    return (
      <form className='ui form'>
        <TextArea
            onBlur={this.handleSubmit.bind(this)}
            id="live-input"
            ref='nameField'
            rows={1}
            tabIndex={2}
            key={'foo'+this.props.name}
            defaultValue={this.props.name}
          >
        </TextArea>
      </form>
    )
  }
}

export default class MetricName extends Component {
  displayName: 'MetricName'
  state = {isEditing: false}

  handleClick(e) {
    this.setState({isEditing: true})
  }

  handleSubmit(e) {
    this.setState({isEditing: false})
    this.props.onChange(e)
  }

  render() {
    const {isEditing} = this.state
    const {name} = this.props || 'name'
    return isEditing ?
      (
           <MetricForm
             key={name+'foo'}
             handleSubmit={this.handleSubmit.bind(this)}
             name={name}
           />
      )
          :
            (
          <span className='MetricName--plain'
            onMouseDown={this.handleClick.bind(this)}
          >
            {name}
          </span>
            )


  }
}

