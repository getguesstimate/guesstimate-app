import React, {Component} from 'react' 
import PropTypes from 'prop-types'
import ComponentEditor from 'gComponents/utility/ComponentEditor/index.js'
import {PlanIndex} from './PlanIndex'

const options = [
  {
    context: 'a logged out user',
    props: {
      userPlanId: '',
      portalUrl: '',
      isLoggedIn: false
    }
  },
  {
    context: 'a new user',
    props: {
      userPlanId: 'personal_free',
      portalUrl: '',
      isLoggedIn: true,
    }
  },
  {
    context: 'an infinite user',
    props: {
      userPlanId: 'personal_infinite',
      portalUrl: '',
      isLoggedIn: true,
    }
  },
  {
    context: 'a user with payment account',
    props: {
      userPlanId: 'personal_small',
      portalUrl: 'http://google.com',
      isLoggedIn: true,
    }
  },
]

export default class PlanStyleGuide extends Component{
  displayName: 'Settings-StyleGuide'
  render () {
    return (
      <div className='full-width'>
        {options.map(option => {
          return (
            <ComponentEditor
              child={PlanIndex}
              childProps={option.props}
              name={`PlanIndex`}
              context={option.context}
              key={option.context}
              backgroundColor={'grey'}
            />
          )
        })}
      </div>
    )
  }
}
