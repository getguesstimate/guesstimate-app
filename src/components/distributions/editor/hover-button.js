import React, {Component, PropTypes} from 'react'

export default class HoverButton extends Component {
  handleMouseOver() {
    this.props.onHoverChange(this.props.name)
  }
  handleMouseOut() {
    this.props.onHoverChange(null)
  }
  handleClick() {
    this.props.onClick(this.props.name)
  }
  render() {
    let className = 'ui button'
    className = className + (this.props.isSelected ? ' black' : '')
    return (
      <div className={className}
          onClick={this.handleClick.bind(this)}
          onMouseOut={this.handleMouseOut.bind(this)}
          onMouseOver={this.handleMouseOver.bind(this)}
      >
        {this.props.name}
      </div>
    )
  }
}
