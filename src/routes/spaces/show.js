import React, {Component, PropTypes} from 'react'
import SpaceCanvas from 'components/canvas-space/canvas-space'
import { connect } from 'react-redux';

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
      <div className='container-fluid'>
        <div className='row'>
          <div className='col-sm-10'>
            <h2> {space ? space.name : ''} </h2>
          </div>
        </div>
      </div>
      <SpaceCanvas/>
      </div>
    )
  }
}
