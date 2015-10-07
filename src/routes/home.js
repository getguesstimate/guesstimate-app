import React, {Component, PropTypes} from 'react'
import Icon from'react-fa'
import { connect } from 'react-redux';
import * as spaceActions from 'gModules/spaces/actions.js';
import {ListGroup, ListGroupItem} from 'react-bootstrap/lib';
import SpaceList from 'gComponents/spaces/list'
import './main.css'

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
      <div className='wrap container-fluid'>
        <h2 className='ui header'>
          <div className='content'>
            {'Collections'}
            <div className='sub header'>
              {'Each can have several metrics.'}
            </div>
          </div>
          <a href='/space/new' className='ui primary button right floated'>
            {'New Collection'}
          </a>
        </h2>

        <div className='ui divider'></div>
        <div className='spaceList'>
          <SpaceList spaces={spaces.asMutable()}/>
        </div>
      </div>
    )
  }
}
