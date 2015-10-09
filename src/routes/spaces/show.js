import React, {Component, PropTypes} from 'react'
import SpaceCanvas from 'gComponents/spaces/canvas'
import { connect } from 'react-redux';
import style from './style.css'
import * as spaceActions from 'gModules/spaces/actions.js'

function mapStateToProps(state) {
  return {
    spaces: state.spaces
  }
}

    //let repo = <Icon spin name="spinner"/>
@connect(mapStateToProps)
export default class repoShow extends Component {
  displayName: 'RepoDetailPage'
  space() {
    return this.props.spaces.asMutable().find(s => (s.id.toString() === this.props.spaceId.toString()))
  }
  destroy() {
    this.props.dispatch(spaceActions.destroy(this.space()))
  }
  render () {
    const space = this.space();
    return (
    <div>
      <div className='hero-unit'>
        <div className='container-fluid'>
          <div className='ui secondary menu'>
            <div className='item'>
              <h1> {space ? space.name : ''} </h1>
            </div>
            <div className='right  menu'>
              <div className='item'>
                <a className='ui button red' href='' onClick={this.destroy.bind(this)}> Delete </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      { space && <SpaceCanvas spaceId={space.id}/>}
      </div>
    )
  }
}
