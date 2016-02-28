import React, {Component, PropTypes} from 'react'
import ComponentEditor from 'gComponents/utility/ComponentEditor/index.js'
import PlanIndex from './PlanIndex.js'

const options = [
  {
    context: 'a logged out user',
    props: {
      planId: '',
      portalUrl: ''
    }
  },
  {
    context: 'a new user',
    props: {
      planId: 'personal_free',
      portalUrl: ''
    }
  },
  {
    context: 'an infinite user',
    props: {
      planId: 'personal_infinite',
      portalUrl: ''
    }
  },
  {
    context: 'a user with payment account',
    props: {
      planId: 'personal_small',
      portalUrl: 'http://google.com'
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
              key={option.props.planId}
              backgroundColor={'grey'}
            />
          )
        })}
      </div>
    )
  }
}
