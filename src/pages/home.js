import React from 'react'
import ampersandMixin from 'ampersand-react-mixin'
import Icon from'react-fa'

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
      <div>
        <h1> Guesstimate.  Guesstimate all the things!</h1>

       {repos.models.map((repo) => {
            return (
              <RepoItem repo={repo}/>
            )
          })}
      </div>
    )
  }
})

