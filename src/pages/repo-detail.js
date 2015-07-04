import React from 'react'
import App from '../../scripts/flux/components/app'

export default React.createClass({
  displayName: 'RepoDetailPage',

  render () {
    const {repo} = this.props
    return (
      <App graphData = {repo.data} />
    )
  }
})
