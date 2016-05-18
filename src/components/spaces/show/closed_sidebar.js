import React, {Component} from 'react'

import Icon from 'react-fa'

export default class ClosedSpaceSidebar extends Component {
  render() {
    return (
      <div className='ClosedSpaceSidebar'>
        <div className='ui button blue small open' onClick={this.props.onOpen}>
          <Icon name='chevron-right'/>
        </div>
      </div>
    )
  }
}
