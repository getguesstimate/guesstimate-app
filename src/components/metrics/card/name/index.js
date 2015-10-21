import React, {Component, PropTypes} from 'react';
import TextArea from 'react-textarea-autosize';
import ReactDOM from 'react-dom'
import _ from 'lodash'
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
            ref={'input'}
            tabIndex={2}
            defaultValue={this.props.name}
            placeholder={'name'}
            value={this.state.value}
            onBlur={this.handleSubmit.bind(this)}
            onChange={e => this.setState({value: e.target.value})}
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

