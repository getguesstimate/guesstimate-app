import React, {Component, PropTypes} from 'react'
import Login from'../login'
import './style.css'
import Logo from '../../../assets/logo-grey-2.png'

const Header = React.createClass({
  displayName: 'Header',
  render () {
    const {isFluid, isBare} = this.props
    let className = 'PageHeader'
    className += isBare ? ' isBare' : ''

    let containerName = 'container-fluid'
    containerName += !isFluid ? ' wrap' : ''
    return (
      <div className={className}>
        <div className={containerName}>
          <div className="menu">

            {!isBare &&
              <div className='header-left-menu'>
                <a className="navbar-brand" href="/">
                  <div className='guesstimate-icon'>
                    <img src={Logo} />
                  </div>
                  <div className='guesstimate-name'>Guesstimate</div>
                </a>
              </div>
            }

            <Login/>
          </div>
        </div>
      </div>
    );
  }
});

export default Header;
