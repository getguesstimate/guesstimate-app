import React from 'react'
import GraphEditor from 'components/canvas-space'
import ampersandMixin from 'ampersand-react-mixin'
import Icon from'react-fa'

export default React.createClass({
  mixins: [ampersandMixin],

  displayName: 'RepoDetailPage',

  render () {
    let repo = <Icon spin name="spinner"/>
    if (app.me.repos.models.length != 0) {
      let rep = app.me.repos.getByName(this.props.repo)
      repo = <GraphEditor repo={rep} savable={true} key={this.props.repo} />
    }
    return (
      <div className='repo-page'>
        {repo}
      </div>
    )
  }
})
