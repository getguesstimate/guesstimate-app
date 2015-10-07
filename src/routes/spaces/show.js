import React, {Component, PropTypes} from 'react'
import SpaceCanvas from 'gComponents/spaces/canvas'
import { connect } from 'react-redux';
import style from './style.css'

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
        <div className='container-fluid'>
          <h1> {space ? space.name : ''} </h1>
        </div>
      </div>
      { space && <SpaceCanvas spaceId={space.id}/>}
      <div className='ui divider'/>
      </div>
    )
  }
}
