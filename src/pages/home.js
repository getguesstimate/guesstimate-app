import React from 'react'
import ampersandMixin from 'ampersand-react-mixin'

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
              <div>
                <a href={repo.appUrl} className='btn btn-primary'>{repo.name}</a>
              </div>
            )
          })}
      </div>
    )
  }
})

