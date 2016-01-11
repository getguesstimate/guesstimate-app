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
    const {userId, users} = this.props
    let user = null

    if (users && users.length) {
      user = users.find(u => u.id.toString() === userId.toString())
    }

    return (
      <div className='userShow'>
        <GeneralSpaceIndex userId={userId}>
          <div className='main-user-tag'>
            {user &&
              <img
                  src={user.picture}
              />
            }
          </div>
            {user &&
              <h2>
                {user.name}
              </h2>
            }
        </GeneralSpaceIndex>
    </div>
    )
  }
}
