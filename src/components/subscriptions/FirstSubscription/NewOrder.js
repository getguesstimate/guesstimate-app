import React, {Component, PropTypes} from 'react'
import $ from 'jquery'
import {connect} from 'react-redux'

export default class NewOrder extends Component {
  componentDidMount() {
    const iframeContainer = '.NewOrder'
    const {page, name, onSuccess, onCancel} = this.props

    ChargeBee.embed(page, name).load({
      addIframe(iframe) {
        $(iframeContainer).append(iframe)
      },
      onLoad(iframe, width, height) {
        var style= 'border:none;overflow:hidden;width:500px;';
        style = style + 'height:' + height + 'px;';
        style = style + 'display:none;';//This is for slide down effect
        iframe.setAttribute('style', style);
        $(iframe).show()
      },
      onResize(iframe, width, height) {
        var style= 'border:none;overflow:hidden;width:500px;';
        style = style + 'height:' + height + 'px;';
        iframe.setAttribute('style',style);
      },
      onSuccess(iframe) {
        onSuccess()
      },
      onCancel(iframe){
        onCancel()
      }
     })
  }

  render() {
    return (
      <div className='NewOrder'/>
    )
  }
}
