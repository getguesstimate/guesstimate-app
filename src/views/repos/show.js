import React from 'react'
import GraphEditor from 'components/repo_editor/base'
import ampersandMixin from 'ampersand-react-mixin'
import Icon from'react-fa'

export default React.createClass({
  mixins: [ampersandMixin],

  displayName: 'RepoDetailPage',

  render () {
    let repo = <Icon spin name="spinner"/>
    if (app.me.repos.models.length != 0) {
      let rep = app.me.repos.getByName(this.props.repo)
      repo = <GraphEditor repo={rep} savable={true} />
    }
    return (
      <div className='repo-page'>
        {repo}
      </div>
    )
  }
})
