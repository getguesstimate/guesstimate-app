import React, {Component, PropTypes} from 'react';
import ReactDOM from 'react-dom'
import Icon from 'react-fa'
import './style.css'

export default class DataViewer extends Component{
  state = {mode: 'VIEW'}

  beginEditing() {
    this.setState({mode: 'EDIT'})
  }

  render() {
    return (
    <div className='DataViewer ui segments'>
      <div className='ui segment DataViewer--header'>
        <Header
          onDelete={this.props.onDelete}
          onEdit={() => {this.setState({mode: 'EDIT'})}}
          onEditCancel={() => {this.setState({mode: 'VIEW'})}}
          mode={this.state.mode}/>
      </div>
      <div className='ui segment'>
        {this.state.mode === 'VIEW' &&
          <Viewer data={this.props.data}/>
        }
        {this.state.mode === 'EDIT' &&
          <Editor data={this.props.data}/>
        }
      </div>
    </div>
    )
  }
}

const Header = ({mode, onDelete, onEdit, onEditCancel}) => (
  <div className='row'>
    <div className='col-sm-5'>
      <h2> <Icon name='bar-chart'/> Custom Data </h2>
    </div>
    {mode === 'VIEW' &&
      <div className='col-sm-7'>
        <a onClick={onDelete} className='delete'> <Icon name='close'/> </a>
        <a onClick={onEdit} className='edit'> <Icon name='pencil'/> </a>
      </div>
    }
    {mode === 'EDIT' &&
      <div className='col-sm-7'>
        <div className='ui button tiny' onClick={onEditCancel}> <Icon name='close'/> </div>
        <div className='ui button primary tiny'> Save </div>
      </div>
    }
  </div>
)

class Editor extends Component{
  render() {
    return (
      <textarea defaultValue={this.props.data.join('\n')}/>
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
