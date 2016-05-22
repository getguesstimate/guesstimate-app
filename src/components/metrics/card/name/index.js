import React, {Component, PropTypes} from 'react'

import TextArea from 'react-textarea-autosize'

import './style.css'

export default class MetricName extends Component {
  displayName: 'MetricName'

  static propTypes = {
    name: PropTypes.string,
    inSelectedCell: PropTypes.bool.isRequired,
    onChange: PropTypes.func.isRequired,
  }

  state = {
    value: this.props.name,
    editing: false,
    persistEditing: false,
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.name === this.state.value) {this.setState({value: nextProps.name})}
  }

  shouldComponentUpdate(nextProps, nextState) {
    return ((nextProps.name !== this.props.name) ||
            (nextProps.inSelectedCell !== this.props.inSelectedCell) ||
            (nextState.value !== this.state.value) ||
            (nextState.editing !== this.state.editing))
  }

  handleSubmit() {
    if (this._hasChanged()){
      this.props.onChange({name: this.state.value})
    }
    this.setState({editing: false, persistEditing: false})
  }

  _hasChanged() {
    return (this.state.value != this.props.name)
  }

  _handleMouseLeave() {
    if (!(this.state.persistEditing || this._hasChanged())) {
      this.setState({editing: false})
    }
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
        {this.state.editing &&
          <TextArea
            onBlur={this.handleSubmit.bind(this)}
            onChange={this.onChange.bind(this)}
            onKeyDown={this.handleKeyDown.bind(this)}
            onMouseLeave={this._handleMouseLeave.bind(this)}
            placeholder={'name'}
            ref={'input'}
            tabIndex={2}
            value={this.state.value}
          />
        }
        {!this.state.editing &&
          <div className={`static${!this.state.value ? ' default-value' : ''}`}
            onMouseOver={() => {if (!this.state.editing) {this.setState({editing: true})}}}
            onClick={() => {this.setState({persistEditing: true})}}
          >
            {this.state.value || 'name'}
          </div>
        }
      </div>
    )
  }
}
