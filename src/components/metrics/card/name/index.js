import React, {Component, PropTypes} from 'react';
import TextArea from 'react-textarea-autosize';
import ReactDOM from 'react-dom'
import './style.css'

export default class MetricName extends Component {
  displayName: 'MetricName'

  state = {value: this.props.name}

  handleSubmit() {
    if (this._hasChanged()){
      console.log('changed name')
      this.props.onChange({name: this.state.value})
    }
  }

  _hasChanged() {
    return (this.state.value !== this.props.name)
  }

  hasContent() {
    return !_.isEmpty(this.state.value)
  }

  componentWillUnmount() {
    this.handleSubmit()
  }

  render() {
    return (
      <TextArea className='MetricName'
          defaultValue={this.props.name}
          onBlur={this.handleSubmit.bind(this)}
          onChange={e => this.setState({value: e.target.value})}
          placeholder={'name'}
          ref={'input'}
          tabIndex={2}
          value={this.state.value}
      />
    )
  }
}
