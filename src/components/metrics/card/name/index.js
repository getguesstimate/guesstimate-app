import React, {Component, PropTypes} from 'react';
import TextArea from 'react-textarea-autosize';
import ReactDOM from 'react-dom'
import _ from 'lodash'
import './style.css'

export default class MetricName extends Component {
  displayName: 'MetricName'

  handleSubmit() {
    this.props.onChange({name: this.refs.input.value})
  }

  shouldComponentUpdate(nextProps) {
    return (nextProps.name !== this.props.name)
  }

  render() {
    return (
        <TextArea className='MetricName'
            onBlur={this.handleSubmit.bind(this)}
            ref={'input'}
            tabIndex={2}
            defaultValue={this.props.name}
          >
        </TextArea>
    )
  }
}

 class MetricName3 extends Component {
  displayName: 'MetricName'

  handleSubmit(e) {
    this.props.onChange(e)
  }

  render() {
    const {name} = this.props || 'name'
    return (
      <MetricForm
       key={name+'foo'}
       handleSubmit={this.handleSubmit.bind(this)}
       name={name}
      />
    )
  }
}

