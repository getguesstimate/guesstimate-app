import React, {Component, PropTypes} from 'react';
import ReactDOM from 'react-dom'
import Icon from 'react-fa'
import './style.css'

class Header extends Component{
  render() {
    return (
      <div className='row'>
        <div className='col-sm-4'>
          <h2> <Icon name='bar-chart'/> Data </h2>
        </div>
        <div className='col-sm-8'>
          <div className='ui button red tiny' onClick={this.props.onDelete}> Delete </div>
          <div className='ui button basic grey tiny'> Edit </div>
        </div>
      </div>
    )
  }
}

export default class DataViewer extends Component{
  render() {
    return (
    <div className='DataViewer ui segments'>
      <div className='ui segment DataViewer--header'>
        <Header onDelete={this.props.onDelete}/>
      </div>
      <div className='ui segment'>
        <ul>
        {this.props.data.map((element, index) => {
          return (
            <li key={index}>
              <DataPoint point={element} key={index}/>
            </li>
            )
        })}
        </ul>
      </div>
    </div>
    )
  }
}

class DataPoint extends Component{
  render() {
    return (
    <div className='DataPoint'>
      {this.props.point}
    </div>
    )
  }
}
