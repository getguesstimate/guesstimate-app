import React, {Component} from 'react' 
import PropTypes from 'prop-types'
import Login from'../login'
import './style.css'
import { connect } from 'react-redux';
import logo from '../../../assets/new-logo-2.png'

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
                  <div className='guesstimate-name'>Guesstimate</div>
                  <img className='guesstimate-icon' src={logo}/>
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
