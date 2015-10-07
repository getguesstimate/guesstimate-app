import React, {Component, PropTypes} from 'react'
import SpaceCanvas from 'gComponents/spaces/canvas'
import { connect } from 'react-redux';
import style from './show.styl'

function mapStateToProps(state) {
  return {
    spaces: state.spaces
  }
}

    //let repo = <Icon spin name="spinner"/>
@connect(mapStateToProps)
export default class repoShow extends Component {
  displayName: 'RepoDetailPage'
  render () {
    const space = this.props.spaces.asMutable().find(s => (s.id.toString() === this.props.spaceId.toString()))
    return (
      <div>
        <div className='hero-unit'>
          <h2> <a href='/' >{'Populations'}</a> / {space ? space.name : ''} </h2>
        </div>
        { space ? <SpaceCanvas spaceId={space.id}/> : ''}
      </div>
    )
  }
}
