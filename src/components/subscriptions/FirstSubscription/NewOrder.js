import React, {Component, PropTypes} from 'react'
import $ from 'jquery'
import {connect} from 'react-redux'

const newStyle = (height, hidden) => {
  let style = `
    width: 400px;
    border: 4px solid rgb(250,250,250);
    border-radius: 3px;
    overflow: hidden;
  `
  style += 'height:' + (height + 10) + 'px;'
  hidden && (style += 'display:none;')
  return style
}

export default class NewOrder extends Component {
  componentDidMount() {
    const iframeContainer = '.NewOrder'
    const {page, name, onSuccess, onCancel} = this.props

    ChargeBee.embed(page, name).load({
      addIframe(iframe) {
        $(iframeContainer).append(iframe)
      },
      onLoad(iframe, _width, height) {
        $(iframe).show()
        iframe.setAttribute('style', newStyle(height, true));
        $(iframe).fadeIn(500)
      },
      onResize(iframe, _width, height) {
        iframe.setAttribute('style', newStyle(height, false));
      },
      onSuccess(iframe) { onSuccess() },
      onCancel(iframe){ onCancel() }
     })
  }

  render() {
    return (
      <div className='NewOrder'/>
    )
  }
}
