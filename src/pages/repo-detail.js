import React from 'react'
import GraphEditor from '../components/graph_editor/flux/components/graph_editor_base'

export default React.createClass({
  displayName: 'RepoDetailPage',

  render () {
    const {repo} = this.props
    return (
      <GraphEditor repo={repo} />
    )
  }
})
