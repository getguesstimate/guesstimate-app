import React, {Component, PropTypes} from 'react';
import TextArea from 'react-textarea-autosize';
import './style.css'

export default class MetricName extends Component {
  displayName: 'MetricName'

  static propTypes = {
    name: PropTypes.string.isRequired,
    isSelected: PropTypes.bool.isRequired,
    onChange: PropTypes.func.isRequired,
  }

  state = {value: this.props.name}

  shouldComponentUpdate(nextProps, nextState) {
    return ((nextProps.name !== this.props.name) ||
            (nextProps.isSelected !== this.props.isSelected) ||
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

  render() {
    return (
      <div className='MetricName'>
        <TextArea className='MetricName'
            defaultValue={this.props.name}
            onBlur={this.handleSubmit.bind(this)}
            onChange={e => this.setState({value: e.target.value})}
            placeholder={'name'}
            ref={'input'}
            tabIndex={2}
            value={this.state.value}
        />
      </div>
    )
  }
}
