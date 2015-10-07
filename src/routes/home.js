import React, {Component, PropTypes} from 'react'
import Icon from'react-fa'
import { connect } from 'react-redux';
import * as spaceActions from 'gModules/spaces/actions.js';
import {ListGroup, ListGroupItem} from 'react-bootstrap/lib';
import css from '../../semantic/dist/semantic.css'
import SpaceList from 'gComponents/spaces/list'

function mapStateToProps(state) {
  return {
    spaces: state.spaces,
    metrics: state.metrics
  }
}

class MetricShow extends Component{
  render() {
    const {metric} = this.props
    return (
      <a className='item'>
        <div className='left floated content'>
        <div className='ui label'>
          34
        </div>
        </div>
        <div className='content'>
        <div className='header'>
          {metric.name}
        </div>
        </div>
      </a>
    )
  }
}

@connect(mapStateToProps)
export default class Home extends Component{
  displayName: 'Home'
  render () {
    const {spaces, metrics} = this.props
    return (
      <div className='container'>
        <h1 className='text-center'> Estimate all the Things!</h1>
        <h2 className='text-center'> <Icon name='table'/> Boards </h2>
        <div className='spaceList'>
          <SpaceList spaces={spaces.asMutable()}/>
        </div>
      </div>
    )
  }
}
