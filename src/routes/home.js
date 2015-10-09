import React, {Component, PropTypes} from 'react'
import Icon from'react-fa'
import { connect } from 'react-redux';
import {ListGroup, ListGroupItem} from 'react-bootstrap/lib';
import SpaceList from 'gComponents/spaces/list'
import _ from 'lodash'
import './main.css'

function mapStateToProps(state) {
  return {
    spaces: state.spaces,
    metrics: state.metrics
  }
}

@connect(mapStateToProps)
export default class Home extends Component{
  displayName: 'Home'
  render () {
    const {spaces, metrics} = this.props
    let style = {paddingTop: '3em'}
    const showSpaces = spaces.asMutable().filter(s => (_.isUndefined(s.deleted) || !s.deleted ))
    return (
      <div className='wrap container-fluid' style={style}>
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
          <SpaceList spaces={showSpaces}/>
        </div>
      </div>
    )
  }
}
