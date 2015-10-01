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

class Space extends Component{
  render() {
    return (
      <div> {this.props.space.name} </div>
    )
  }
}

const RepoItem = React.createClass({
  delete () {
    this.props.repo.destroy()
  },
  render () {
    return (
      <div>
        <a href={this.props.repo.appUrl} >{this.props.repo.name}</a>
        <span onClick={this.delete}><Icon name='times'/> </span>
      </div>
    )
  }
})

@connect(mapStateToProps)
export default class Home extends Component{
  displayName: 'Home'
  getSpace() {
    this.props.dispatch(spaceActions.get())
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

         //{repos.models.map((repo) => {
              //return (
                //<RepoItem repo={repo}/>
              //)
            //})}
