import React from 'react'
import ampersandMixin from 'ampersand-react-mixin'

export default React.createClass({
  mixins: [ampersandMixin],

  displayName: 'Home',
  render () {
    const {repos} = this.props

    return (
      <div className='container'>
        <h1> Guestimate.  Guestimate all the things!</h1>

        <a href='/repo' className='btn btn-primary'>
          See a model!
        </a>
       {repos.models.map((repo) => {
            return (
              <div>
                <a href={repo.appUrl}>{repo.name}</a>
              </div>
            )
          })}
      </div>
    )
  }
})

