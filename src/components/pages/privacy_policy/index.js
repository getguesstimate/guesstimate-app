import React, {Component} from 'react' 
import PropTypes from 'prop-types'
import IubendaPrivacyPolicy from 'gComponents/lib/iubenda_privacy_policy.js'

export default class PrivacyPolicy extends Component{
  displayName: 'PrivacyPolicy'
  render () {
    return (
      <div>
        <IubendaPrivacyPolicy id={7790420}>
          Privacy Policy
        </IubendaPrivacyPolicy>
      </div>
    )
  }
}
