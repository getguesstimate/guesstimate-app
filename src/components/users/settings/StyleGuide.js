import React, {Component, PropTypes} from 'react'
import ComponentEditor from 'gComponents/utility/ComponentEditor/index.js'
import Settings from './index.js'

const Props = {
}

export default class SettingsStyleGuide extends Component{
  displayName: 'Settings-StyleGuide'
  render () {
    return (
      <div className='container-fluid full-width'>
        {
          [1].map(stage => {
            return (
              <ComponentEditor
                child={Settings}
                childProps={Props}
                name={'Settings'}
                key={stage}
              />
            )
          })
        }
      </div>
    )
  }
}
