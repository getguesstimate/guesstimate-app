import React from 'react'

export default React.createClass({
  displayName: 'RepoDetailPage',

  render () {
    const {repo} = this.props

    return (
      <div>
      <h1> This is awesome! {repo.name}</h1>
      <p>foobar</p>
      </div>
    )
  }
})
