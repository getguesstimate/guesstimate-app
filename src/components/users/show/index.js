import React, {Component, PropTypes} from 'react'
import Icon from'react-fa'
import { connect } from 'react-redux';
import SpaceList from 'gComponents/spaces/list'
import './style.css'

function mapStateToProps(state) {
  return {
    spaces: state.spaces,
    metrics: state.metrics,
    me: state.me,
    users: state.users,
  }
}

@connect(mapStateToProps)
export default class UserShow extends Component{
  displayName: 'User'
  render () {
    const {spaces, metrics, users} = this.props
    let style = {paddingTop: '3em'}
    let isReady = (spaces.length && users.length)
    let showSpaces = null
    let user = null
    let modelString = null

    if (isReady) {
      showSpaces = spaces.asMutable().filter(s => (_.isUndefined(s.deleted) || !s.deleted ))
      showSpaces = showSpaces.filter(s => s.user_id).filter(s => (s.user_id.toString() === this.props.userId.toString()))
      user = this.props.users.find(u => u.id.toString() === this.props.userId.toString())
      modelString = showSpaces.length === 1 ? (showSpaces.length + ' model') : (showSpaces.length + ' models')
    }


    return (
      <div className='wrap container-fluid userShow' style={style}>
        {user &&
        <h2 className='ui header'>
          <div className='row'>
            <div className='col-sm-10'>
              <div className='user-tag'>
                <img
                    className='ui avatar image'
                    src={user.picture}
                />
              </div>
              <div>
                {user.name}
                <div className='sub header'>
                  {modelString}
                </div>
              </div>
            </div>
          </div>
        </h2>
        }

        <div className='ui divider'></div>
        {showSpaces && showSpaces.length &&
          <div className='spaceList'>
            <SpaceList spaces={showSpaces} showUsers={false}/>
          </div>
        }
      </div>
    )
  }
}
