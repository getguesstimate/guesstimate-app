import React, {Component, PropTypes} from 'react'
import $ from 'jquery'

export default class NewOrder extends Component {
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

export default class Payments extends Component {
  displayName: 'Payments'

  onOrderSuccess() {
    console.log('success')
  }

  onOrderCancel() {
    console.log('error')
  }

  render () {
    window.charge = ChargeBee
    return (
      <div className='container-fluid full-width homePage'>
        <h1> foobar </h1>
        <NewOrder
          page={'https://guesstimate-test.chargebee.com/pages/v2/b5FeGofJf2Wmn4tdZ7Jb9cqheWKavncdp/checkout'}
          name={'guesstimate-test'}
          onSuccess={this.onOrderSuccess.bind(this)}
          onCancel={this.onOrderCancel.bind(this)}
        />
      </div>
    )
  }
}
