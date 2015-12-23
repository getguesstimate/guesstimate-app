import React, {Component, PropTypes} from 'react'
import Icon from 'react-fa'

export default class SpaceSidebar extends Component {
  render() {
    return (
      <div className='SpaceSidebar'>
        <div className='SpaceSidebar-header'>
          <div className='ui button close' onClick={this.props.onClose}>
            <Icon name='chevron-left'/>
          </div>
        </div>
      </div>
    )
  }
}

export default SpaceSidebar
