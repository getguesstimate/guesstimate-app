import React from 'react'
import ampersandMixin from 'ampersand-react-mixin'
import Icon from'react-fa'
import SpaceCanvas from 'components/canvas-space/canvas-space'

export default React.createClass({
  mixins: [ampersandMixin],

  displayName: 'RepoDetailPage',

  render () {
    let repo = <Icon spin name="spinner"/>
    return (
      <div>
      <div className='container-fluid'>
        <div className='row'>
          <div className='col-sm-10'>
            <h2> oagr/boston-pianao-population </h2>
          </div>
        </div>
      </div>
      <SpaceCanvas/>
      </div>
    )
  }
})
