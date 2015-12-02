import React, {Component, PropTypes} from 'react'
import ToolTip from 'gComponents/utility/tooltip/index.js'
import {MarkdownViewer} from 'gComponents/utility/markdown-viewer/index.js'
import ReactMarkdown from 'react-markdown'

export default class MetricToolTip extends Component {
  render() {
    const {guesstimate} = this.props
    if (_.isEmpty(guesstimate.description)){
      return (false)
    } else {
      return (
        <ToolTip>
          <MarkdownViewer source={guesstimate.description}/>
        </ToolTip>
      )
    }
  }
}
