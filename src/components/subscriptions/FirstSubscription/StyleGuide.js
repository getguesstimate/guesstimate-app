import React, {Component} from 'react' 
import PropTypes from 'prop-types'
import FirstSubscription from './FirstSubscription.js'
import ComponentEditor from 'gComponents/utility/ComponentEditor/index.js'
import {subStages} from 'gModules/first_subscription/state_machine'

const FirstSubscriptionBaseProps = {
  planId: 'small',
  paymentAccountPortalUrl: 'http://foobar.com',
  iframeUrl: 'http://foobar.com',
  iframeWebsiteName: 'good-stuff',
  onPaymentCancel: function(g) { console.log(g) },
  onPaymentSuccess: function(g) { console.log(g) }
}

function FirstSubscriptionStage(stage){
  return Object.assign({}, FirstSubscriptionBaseProps, {flowStage: stage})
}

export default class FirstSubscriptionStyleGuide extends Component{
  displayName: 'ComponentEditor-StyleGuide'
  render () {
    const flowStage = 'UNNECESSARY'
    return (
      <div className='container-fluid full-width'>
        {
          subStages.map(stage => {
            return (
              <ComponentEditor
                child={FirstSubscription}
                childProps={FirstSubscriptionStage(stage)}
                name={stage}
                key={stage}
              />
            )
          })
        }
      </div>
    )
  }
}
