import React from 'react'

export default React.createClass({
  displayName: 'Home',
  render () {
    return (
      <div className='container'>
        <h1> Guestimate.  Guestimate all the things!</h1>

        <a href='/model' className='btn btn-primary'>
          See a model!
        </a>
      </div>
    )
  }
})

