import React, {Component, PropTypes} from 'react'
import Icon from'react-fa'
import { connect } from 'react-redux';
import SpaceList from 'gComponents/spaces/list'
import * as spaceActions from 'gModules/spaces/actions'
import * as userActions from 'gModules/users/actions'
import './style.css'
import { userSpaceSelector } from './userSpaceSelector.js';
import Container from 'gComponents/utility/container/Container.js'

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

    let user = null

    if (users && users.length) {
      user = users.find(u => u.id.toString() === userId.toString())
    }

    return (
      <Container>
        <div className='userShow'>
          <div className='GeneralSpaceIndex row'>
            <div className='col-sm-3'>
              <div className='row'>

                <div className='col-sm-12'>
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
                </div>
              </div>
            </div>

            <div className='col-sm-9'>
              {spaces &&
                <SpaceList
                  spaces={spaces}
                  showUsers={false}
                  hasMorePages={false}
                  showScreenshots={true}
                />
              }
            </div>
          </div>
        </div>
      </Container>
    )
  }
}
