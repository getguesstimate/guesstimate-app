import React, {Component, PropTypes} from 'react'
import Logo from '../../assets/logo-grey-2.png'
import LogoWord from '../../assets/logo-word.png'
import './style.css'
import video from '../../assets/video-2.png'
import creationModel from '../../assets/tiny-models/creation.png'

export default class Home extends Component {
  displayName: 'Home'
  render () {
    return (
      <div className='homePage'>
        <div className='container-fluid full-width'>
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
                  <h2>A spreadsheet for things<br/>that aren&rsquo;t certain</h2>
                </div>

              </div>
            </div>
          </div>

          <div className='row'>
            <div className='col-xs-12 cta'>
              <a href='/models' className='ui button huge primary'> Browse Public Models </a>
            </div>
          </div>

          <div className='row'>
            <div className='col-xs-12'>
              <span className="wistia_embed wistia_async_ua8kd9n06a popover=true popoverAnimateThumbnail=true videoFoam=true" >
                &nbsp;
              </span>
            </div>
          </div>
        </div>

        <div className='container-fluid full-width sectionBenefits'>
          <div className='wrap'>
            <div className='row'>
              <div className='col-sm-4'>
                <i className='ion-ios-egg'/>
                <h2> Simple </h2>
                <p>
                  Make a great estimate in seconds.<br/>
                  If you think a number is between <strong>5</strong> and <strong>9</strong>, <br/>
                  simple write <strong>[5,9]</strong>.
                </p>
              </div>
              <div className='col-sm-4'>
                <i className='ion-md-flame'/>
                <h2> Powerful </h2>
                <p>
                  Guesstimate uses Monte Carlo sampling to correctly estimate uncertain results.
                </p>
              </div>
              <div className='col-sm-4'>
                <i className='ion-ios-rose'/>
                <h2> Free </h2>
                <p>
                  Create unlimited public models for free. <br/>
                  Our code base is <a href='https://github.com/getguesstimate/guesstimate-app'>open source</a>.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className='container-fluid full-width sectionExamples'>
          <div className='wrap'>
            <div className='row'>
              <div className='col-sm-4 description'>
                  <h2> Days to build a Treehouse </h2>
                  <p>
                    It can be difficult to figure out how long planning, designing, and building a treehouse will take.
                    With Guesstimate, you can give your ranges for each of these, and then get the sum of these ranges.
                  </p>
              </div>
              <div className='col-sm-8'>
                <img src={creationModel} />
              </div>
            </div>
          </div>
        </div>

      </div>
    )
  }
}
