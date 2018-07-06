import React, {Component} from 'react' 
import PropTypes from 'prop-types'

export default class IubendaPrivacyPolicy extends Component{
  displayName: 'PrivacyPolicy'

  static propTypes = {
    id: React.PropTypes.number
  }

  componentWillMount () {
    var loadIubenda = function (w,d) {
      var loader = function () {
        var s = d.createElement("script")
        var tag = d.getElementsByTagName("script")[0]
        s.src = "//cdn.iubenda.com/iubenda.js"
        tag.parentNode.insertBefore(s,tag)
      }
      if(w.addEventListener){
        w.addEventListener("load", loader, false)
      } else if(w.attachEvent){
        w.attachEvent("onload", loader)
      } else {
        w.onload = loader;
      }}
    loadIubenda(window, document)
  }

  render() {
    const href = "//www.iubenda.com/privacy-policy/" + this.props.id
    return(
      <a href={href} className="iubenda-nostyle no-brand iubenda-embed" title="Privacy Policy">{this.props.children}</a>
    )
  }
}
