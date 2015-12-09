import React, {Component, PropTypes} from 'react'
import Logo from '../../assets/logo-grey-2.png'
import './style.css'

export default class Home extends Component {
  displayName: 'Home'
  render () {
    return (
      <div className='container-fluid full-width home'>
        <div className='row'>
          <div className='col-md-2'></div>
          <div className='col-md-8 main'>
            <div className='row'>
              <div className='col-sm-12'>
                <div className='guesstimate-logo-outer'>
                  <div className='guesstimate-logo'>
                    <div className='guesstimate-icon'>
                      <img src={Logo} />
                    </div>
                    <div className='guesstimate-name'>Guesstimate</div>
                  </div>
                </div>
              </div>

              <div className='col-sm-12 guesstimate-slogan'>
                <h2>
                  Decide with Confidence
                  <span className='sideComment'> Intervals </span>
                </h2>
                <p> Guesstimate is the simplest way to do math with probability distributions.
                  Use it to reduce the uncertainties in your life.  It's Free.
                </p>
              </div>

            </div>
          </div>
        </div>

        <div className='row'>
          <a href='/spaces' className='ui button huge primary'> Browse Models </a>
        </div>

      </div>
    )
  }
}
