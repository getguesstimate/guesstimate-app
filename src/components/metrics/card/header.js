/* @flow */

import React, {Component, PropTypes} from 'react';
import Input from 'react-bootstrap/lib/Input'
import ShowIf from 'gComponents/utility/showIf';
import TextArea from 'react-textarea-autosize';
import ReactDOM from 'react-dom'

import {connectReduxForm} from 'redux-form';

const MetricReadableIdd = ({readableId}) => (
  <div className='col-sm-1 function-id'>
    {readableId}
  </div>
)
const MetricReadableId = ShowIf(MetricReadableIdd)

class MetricForm extends Component {
  componentDidMount(){
    ReactDOM.findDOMNode(this).focus()
  }
  handleSubmit(){
    this.props.handleSubmit({name: this.refs.nameField.value})
  }
  render() {
    return (
      <form className='ui form'>
      <TextArea
          onBlur={this.handleSubmit.bind(this)}
          ref='nameField'
          rows={1}
          tabIndex={2}
          defaultValue={this.props.name}
        >
      </TextArea>
      </form>
    )
  }
}

class MetricName extends Component {
  displayName: 'MetricName'
  state = {isEditing: false}
  handleClick(e) {
    console.log('changing state?')
    this.setState({isEditing: true})
    e.stopPropagation()
  }
  handleSubmit(e) {
    this.setState({isEditing: false})
    this.props.onChange(e)
  }
  render() {
    const {isEditing} = this.state
    const {name} = this.props || 'name'
    return (
      <div onMouseDown={this.handleClick.bind(this)} >
        {isEditing ?
           <MetricForm
             handleSubmit={this.handleSubmit.bind(this)}
             name={name}
           />
          :
          name
        }
      </div>
    )
  }
}

class MetricHeader extends Component {
  displayName: 'BasicInput'

  static propTypes = {
    anotherFunctionSelected: PropTypes.bool,
    metric: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
  }

  handleNameChange(name) {
    let {id} = this.props.metric;
    this.props.onChange({name})
  }

  render () {
    let {anotherFunctionSelected, metric} = this.props
    return (
     <div className='row'>
       <div className={anotherFunctionSelected ? 'col-sm-9 name' : 'col-sm-12 name'}>
         <MetricName name={metric.name}
           onChange={this.props.onChange}
         />
      </div>
       <div className={anotherFunctionSelected ? 'col-sm-0' : 'col-sm-3'}>
         <MetricReadableId
             readableId={metric.readableId}
             showIf={anotherFunctionSelected}
         />
      </div>
     </div>
    )
  }
}

export default MetricHeader
