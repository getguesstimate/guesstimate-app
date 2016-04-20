import React, {Component, PropTypes} from 'react'
import './style.css'

const PT = PropTypes
export default class ToolTip extends Component {
  displayName: 'ToolTip'

  render() {
    const className = `ToolTip ${this.props.size || 'SMALL'}`
    return (
      <div className={className}>
        <div className='arrow-up'/>
        {this.props.children}
      </div>
    )
  }
}
