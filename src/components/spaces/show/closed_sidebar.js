import React, {Component} from 'react'

import Icon from 'react-fa'

export class ClosedSpaceSidebar extends Component {
  shouldComponentUpdate() { return false }
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
