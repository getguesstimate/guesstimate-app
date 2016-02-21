import React, {Component, PropTypes} from 'react'
import $ from 'jquery'
import {fetch_subscription_iframe} from 'gModules/subscriptions/actions.js'
import {connect} from 'react-redux'

function mapStateToProps(state) {
  return {
    iframe: state.subscriptions.iframe
  }
}

@connect(mapStateToProps)
export default class Payments extends Component {
  displayName: 'Payments'
  componentWillMount() {
    this.props.dispatch(fetch_subscription_iframe())
  }

  onOrderSuccess() {
    console.log('success')
  }

  onOrderCancel() {
    console.log('error')
  }

  render () {
    console.log(this.props)
    const {website_name, url, request: {waiting}} = this.props.iframe
    const has_website = _.isString(website_name)
    return (
      <div className='container-fluid full-width homePage'>
        {waiting && <h1> Loading </h1>}
        {has_website &&
          <NewOrder
            page={url}
            name={website_name}
            onSuccess={this.onOrderSuccess.bind(this)}
            onCancel={this.onOrderCancel.bind(this)}
          />
        }
      </div>
    )
  }
}

export class NewOrder extends Component {
  componentDidMount() {
    const iframeContainer = '.NewOrder'
    ChargeBee.embed(this.props.page, this.props.name).load({
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
        this.props.onSuccess()
      },
      onCancel(iframe){
        this.props.onCancel()
      }
     })
  }

  render() {
    return (
      <div className='NewOrder'/>
    )
  }
}
