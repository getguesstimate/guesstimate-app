import React, {Component, PropTypes} from 'react'
import Icon from'react-fa'
import { connect } from 'react-redux';
import * as spaceActions from '../actions/space-actions.js';
import {ListGroup, ListGroupItem} from 'react-bootstrap/lib'

function mapStateToProps(state) {
  return {
    spaces: state.spaces
  }
}

@connect()
class Space extends Component{
  url() {
    return '/repo/' + this.props.space.id;
  }
  render() {
    return (
      <ListGroupItem header={this.props.space.name} href={this.url()}>
        {this.props.space.description}
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
                  <Space space={s} key={s.id}/>
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
