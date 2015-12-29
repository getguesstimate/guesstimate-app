import React, {Component, PropTypes} from 'react'
import Logo from '../../assets/logo-grey-2.png'
import LogoWord from '../../assets/logo-word.png'
import './style.css'
import video from '../../assets/video-2.png'

export default class Home extends Component {
  displayName: 'Home'
  render () {
    return (
      <div className='container-fluid full-width homePage'>
        <div className='row'>
          <div className='col-md-2'></div>
          <div className='col-md-8 main'>
            <div className='row'>
              <div className='col-sm-12'>
                <div className='guesstimate-logo-outer'>
                  <div className='guesstimate-logo'>
                    <img src={LogoWord} />
                  </div>
                </div>
              </div>

              <div className='col-sm-12 guesstimate-slogan'>
                <h2> {'A spreadsheet for things'} <br/>{"that aren't certain"} </h2>
              </div>

            </div>
          </div>
        </div>

        <div className='row'>
          <div className='col-xs-12 cta'>
            <a href='/models' className='ui button huge primary'> Browse Public Models </a>
          </div>
        </div>

        <span className="wistia_embed wistia_async_ua8kd9n06a popover=true popoverAnimateThumbnail=true videoFoam=true" >
          &nbsp;
        </span>
      </div>
    )
  }
}
