import React, {Component, PropTypes} from 'react'
import Login from'../login'
import './style.css'
import Logo from '../../../assets/logo-grey-2.png'
import { connect } from 'react-redux';

function mapStateToProps(state) {
  return {
    me: state.me,
    organizations: state.organizations,
    userOrganizationMemberships: state.userOrganizationMemberships
  }
}

const loggedIn = (user) =>  {
  return !!(user && user.profile && user.profile.name)
}

@connect(mapStateToProps)
export default class Header extends Component {
  displayName: 'Header'

  render () {
    const isLoggedIn = loggedIn(this.props.me)
    const {isFluid, isBare} = this.props
    let className = 'PageHeader'
    className += isBare ? ' isBare' : ''

    const containerName = isFluid ? 'container-fluid' : 'wrap'

    let navbarRef = isLoggedIn ? '/models' : '/'
    return (
      <div className={className}>
        <div className={containerName}>
          <div className="menu">

            {!isBare &&
              <div className='header-left-menu'>
                <a className="navbar-brand" href={navbarRef}>
                  <div className='guesstimate-icon'>
                    <img src={Logo} />
                  </div>
                  <div className='guesstimate-name'>Guesstimate</div>
                </a>
              </div>
            }

            <Login
              me={this.props.me}
              organizations={this.props.organizations}
              userOrganizationMemberships={this.props.userOrganizationMemberships}
              isLoggedIn={isLoggedIn}
            />
          </div>
        </div>
      </div>
    );
  }
};
