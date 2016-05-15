import React, {Component, PropTypes} from 'react';
import TextArea from 'react-textarea-autosize';
import Keypress from 'react-keypress'
import './style.css'

export default class MetricName extends Component {
  displayName: 'MetricName'

  static propTypes = {
    name: PropTypes.string,
    inSelectedCell: PropTypes.bool.isRequired,
    onChange: PropTypes.func.isRequired,
  }

  state = {value: this.props.name}

  shouldComponentUpdate(nextProps, nextState) {
    return ((nextProps.name !== this.props.name) ||
            (nextProps.inSelectedCell !== this.props.inSelectedCell) ||
            (nextState.value !== this.state.value))
  }

  handleSubmit() {
    if (this._hasChanged()){
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

  onChange(e) {
    this.setState({value: e.target.value})
  }

  handleKeyDown(e) {
    const ENTER = (e) => ((e.keyCode === 13) && !e.shiftKey)
    if (ENTER(e)){
      e.stopPropagation()
      this.props.jumpSection()
    }
  }


  render() {
    return (
      <div className='MetricName'>
        <TextArea
            defaultValue={this.props.name}
            onBlur={this.handleSubmit.bind(this)}
            onChange={this.onChange.bind(this)}
            onKeyDown={this.handleKeyDown.bind(this)}
            placeholder={'name'}
            ref={'input'}
            tabIndex={2}
            value={this.state.value}
        />
      </div>
    )
  }
}
