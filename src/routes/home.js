import React, {Component, PropTypes} from 'react'
import Icon from'react-fa'
import { connect } from 'react-redux';
import * as spaceActions from 'gModules/spaces/actions.js';
import {ListGroup, ListGroupItem} from 'react-bootstrap/lib';
import * as Space from 'gEngine/space';

function mapStateToProps(state) {
  return {
    spaces: state.spaces
  }
}

@connect()
class SpaceShow extends Component{
  render() {
    const {space} = this.props
    return (
      <ListGroupItem header={space.name} href={Space.url(space)}>
        {space.description}
      </ListGroupItem>
    )
  }
}

@connect(mapStateToProps)
export default class Home extends Component{
  displayName: 'Home'
  render () {
    const {spaces} = this.props
    return (
      <div className='home-page'>
        <div className='container'>
          <h1 className='text-center'> Estimate all the Things!</h1>
        </div>
        <div className='container'>
        <div className='row'>
          <div className='col-sm-6'>
          </div>
          <div className='col-md-6'>
            <h2 className='text-center'> Boards </h2>
            <ListGroup>
              {spaces.asMutable().map((s) => {
                return (
                  <SpaceShow space={s} key={s.id}/>
                )
              })}
            </ListGroup>
          </div>
        </div>
        </div>
      </div>
    )
  }
}
