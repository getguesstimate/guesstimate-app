import React, {Component, PropTypes} from 'react';
import ReactDOM from 'react-dom'
import Icon from 'react-fa'
import './style.css'
import {ButtonClose} from 'gComponents/utility/buttons/close'

const Button = ({onDelete}) => (
  <div className='DataViewer DataViewer--card'>
    <a className='ui button primary small'> <Icon name='bar-chart'/> Custom </a>
    <ButtonClose onClick={onDelete}/>
  </div>
)

export default class DataViewer extends Component{
  state = {mode: 'VIEW'}

  beginEditing() {
    this.setState({mode: 'EDIT'})
  }

  onSave(data) {
    this.props.onSave(data)
    this.setState({mode: 'VIEW'})
  }

  render() {
    if (this.props.size === 'large') {
      return (
      <div className='DataViewer ui segments'>
        <div className='ui segment DataViewer--header'>
          <Header
            onDelete={this.props.onDelete}
            onEdit={() => {this.setState({mode: 'EDIT'})}}
            mode={this.state.mode}/>
        </div>
        <div className='ui segment DataViewer--body'>
          {this.state.mode === 'VIEW' &&
            <Viewer data={this.props.data}/>
          }
          {this.state.mode === 'EDIT' &&
            <Editor
              data={this.props.data}
              onEditCancel={() => {this.setState({mode: 'VIEW'})}}
              onSave={this.onSave.bind(this)}
            />
          }
        </div>
      </div>
      )
    } else {
      return (<Button onDelete={this.props.onDelete}/>)
    }
  }
}

const Header = ({mode, onDelete, onEdit, onEditCancel}) => (
  <div className='row'>
    <div className='col-sm-6'>
      <h2> <Icon name='bar-chart'/> Custom Data </h2>
    </div>
    {mode === 'VIEW' &&
      <div className='col-sm-6'>
        <a onClick={onDelete} className='delete'> <Icon name='close'/> Delete </a>
        <a onClick={onEdit} className='edit'> <Icon name='pencil'/> Edit </a>
      </div>
    }
  </div>
)

class Editor extends Component{
  state = {
    value: this.props.data.join('\n'),
    valid: true
  }

  handleChange(event) {
    const value = event.target.value
    this.setState(
      {
        value,
        valid: this._isValid(value)
      }
    );
  }

  _isValid(value) {
    const numbers = this._convertToNumbers(value)
    const allValid = _.all(numbers, e => _.isFinite(e))
    return allValid
  }

  _handleSave() {
    const numbers = this._convertToNumbers(this.state.value)
    this.props.onSave(numbers)
  }

  _convertToNumbers(values) {
    return values.split(/[\n\s,]+/).map(Number)
  }

  render() {
    return (
      <div>
      <div className='ui form'>
        <div className='field'>
          <textarea value={this.state.value} onChange={this.handleChange.bind(this)}/>
        </div>
      </div>
      <div className='ui button primary tiny' onClick={this._handleSave.bind(this)}> Save </div>
      <ButtonClose onClick={this.props.onEditCancel}/>
      </div>
    )
  }
}

const Viewer = ({data}) => (
  <ul>
    {data.map((element, index) => {
      return (
        <li key={index}>
          <DataPoint point={element} key={index}/>
        </li>
        )
    })}
  </ul>
)

class DataPoint extends Component{
  render() {
    return (
    <div className='DataPoint'>
      {this.props.point}
    </div>
    )
  }
}
