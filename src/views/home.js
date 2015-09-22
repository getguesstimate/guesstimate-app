import React from 'react'
import ampersandMixin from 'ampersand-react-mixin'
import Icon from'react-fa'
import Repo from '../models/repo'

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

export default React.createClass({
  mixins: [ampersandMixin],
  displayName: 'Home',
  render () {
    const {repos} = this.props

    return (
      <div className='home-page'>
        <div className='container'>
          <h1 className='text-center'> Estimate all the Things!</h1>
        </div>

        <div className='container text-center'>
          <h2> All Models </h2>
         {repos.models.map((repo) => {
              return (
                <RepoItem repo={repo}/>
              )
            })}
        </div>
      </div>
    )
  }
})
