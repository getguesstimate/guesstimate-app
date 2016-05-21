import React, {Component, PropTypes} from 'react'
import Icon from'react-fa'
import { connect } from 'react-redux';
import SpaceList from 'gComponents/spaces/list'
import * as spaceActions from 'gModules/spaces/actions'
import * as userActions from 'gModules/users/actions'
import './style.css'
import { userSpaceSelector } from './userSpaceSelector.js';
import Container from 'gComponents/utility/container/Container.js'
import SpaceCards from 'gComponents/spaces/cards'

function mapStateToProps(state) {
  return {
    me: state.me,
    users: state.users,
  }
}

@connect(mapStateToProps)
@connect(userSpaceSelector)
export default class UserShow extends Component{
  displayName: 'UserShow'

  componentWillMount(){
    this.props.dispatch(userActions.fetchById(this.props.userId))
    this.props.dispatch(spaceActions.fetch({userId: this.props.userId}))
  }

  render () {
    const {userId, users} = this.props
    const spaces =  _.orderBy(this.props.userSpaces.asMutable(), ['updated_at'], ['desc'])
    const isMe = (parseInt(this.props.me.id) === parseInt(userId))

    let user = null

    if (users && users.length) {
      user = users.find(u => u.id.toString() === userId.toString())
    }

    return (
      <Container>
        <div className='userShow'>
            <div className='GeneralSpaceIndex row'>
              <div className='col-md-4'/>
              <div className='col-md-4'>
                  {user &&
                    <div className='main-user-tag'>
                      <img
                          src={user.picture}
                      />
                      {user &&
                        <h1>
                          {user.name}
                        </h1>
                      }
                    </div>
                  }
              </div>
            </div>
            {spaces &&
              <div className='row'>
                <SpaceCards
                  spaces={spaces}
                  size={'SMALL'}
                  showUsers={false}
                  showPrivacy={isMe}
                />
              </div>
            }
        </div>
      </Container>
    )
  }
}
