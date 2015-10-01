import React, {Component, PropTypes} from 'react'
import ampersandMixin from 'ampersand-react-mixin'
import Icon from'react-fa'
import { connect } from 'react-redux';
import * as spaceActions from '../actions/space-actions.js';

function mapStateToProps(state) {
  return {
    spaces: state.spaces
  }
}

@connect()
class Space extends Component{
  url() {
    return '/repo/' + this.props.space.name;
  }
  destroy() {
    this.props.dispatch(spaceActions.destroy(this.props.space.id))
  }
  render() {
    return (
      <div>
        <a href={this.url()}>{this.props.space.name}</a>
        <span onClick={this.destroy.bind(this)}><Icon name='times'/> </span>
      </div>
    )
  }
}

@connect(mapStateToProps)
export default class Home extends Component{
  displayName: 'Home'
  getSpace() {
    this.props.dispatch(spaceActions.fetch())
  }
  render () {
    const {spaces} = this.props
    return (
      <div className='home-page'>
        <div className='container'>
          <h1 className='text-center'> Estimate all the Things!</h1>
        </div>
        <div className='container text-center'>
          <h2> All Models </h2>
          <btn onClick={this.getSpace.bind(this)}> Foobar </btn>
          {spaces.asMutable().map((s) => {
            return (
              <Space space={s} key={s.id}/>
            )
          })}
        </div>
      </div>
    )
  }
}
