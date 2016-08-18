import React, {Component} from 'react'

import ToolTip from 'gComponents/utility/tooltip/index.js'
import {MarkdownViewer} from 'gComponents/utility/markdown-viewer/index.js'

export default class MetricToolTip extends Component {
  render() {
    const {guesstimate} = this.props
    if (_.isEmpty(guesstimate.description)){
      return (false)
    }
    return (
      <ToolTip>
        <div onMouseDown={e => {e.stopPropagation()}} >
          <MarkdownViewer source={guesstimate.description}/>
        </div>
      </ToolTip>
    )
  }
}
