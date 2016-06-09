import React, {Component, PropTypes} from 'react'
import ComponentEditor from 'gComponents/utility/ComponentEditor/index.js'

import {CreateOrganizationPage} from './index'

export default class PlanStyleGuide extends Component{
  displayName: 'Settings-StyleGuide'
  render () {
    const foo = {newOrg: {id: 34}}
    return (
      <div className=''>
        <ComponentEditor
          child={CreateOrganizationPage}
          childProps={{}}
          name={`PlanIndex`}
          context={'foobar'}
          key={'foobar'}
          backgroundColor={'grey'}
        />
        <ComponentEditor
          child={CreateOrganizationPage}
          childProps={foo}
          name={`PlanIndex`}
          context={'foobar1'}
          key={'foobar1'}
          backgroundColor={'grey'}
        />
      </div>
    )
  }
}
