import React, {Component, PropTypes} from 'react'
import ToolTip from 'gComponents/utility/tooltip/index.js'
import {MarkdownViewer} from 'gComponents/utility/markdown-viewer/index.js'
import ReactMarkdown from 'react-markdown'

export default class MetricToolTip extends Component {
  renderErrors() {
    return this.props.errors.map(error => (
      <li>{error}</li>
    ))
  }

  render() {
    const {guesstimate, errors} = this.props
    if (_.isEmpty(guesstimate.description) && (!errors || errors.length === 0)){
      return (false)
    }
    return (
      <ToolTip>
        {errors && errors.length > 0 &&
          <div className="errors">
            <ul>
              {this.renderErrors()}
            </ul>
          </div>
        }
        <MarkdownViewer source={guesstimate.description}/>
      </ToolTip>
    )
  }
}
