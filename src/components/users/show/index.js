import React, {Component, PropTypes} from 'react'
import Icon from'react-fa'
import { connect } from 'react-redux';
import SpaceList from 'gComponents/spaces/list'
import GeneralSpaceIndex from 'gComponents/spaces/shared/general_space_index.js'
import './style.css'

function mapStateToProps(state) {
  return {
    me: state.me,
    users: state.users,
  }
}

@connect(mapStateToProps)
export default class UserShow extends Component{
  displayName: 'UserShow'
  render () {
    const {users} = this.props
    let user = null

    if (users && users.length) {
      user = this.props.users.find(u => u.id.toString() === this.props.userId.toString())
    }

    return (
      <div className='userShow'>
        {user &&
          <GeneralSpaceIndex userId={user.id}>
            <div className='user-tag'>
              <img
                  className='ui avatar image'
                  src={user.picture}
              />
            </div>
            <h2>
              {user.name}
            </h2>
          </GeneralSpaceIndex>
      }
    </div>
    )
  }
}
