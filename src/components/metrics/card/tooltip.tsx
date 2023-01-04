import _ from "lodash";
import React, { Component } from "react";

import ToolTip from "~/components/utility/tooltip/index";
import { MarkdownViewer } from "~/components/utility/markdown-viewer/index";

export default class MetricToolTip extends Component<{ guesstimate: any }> {
  render() {
    const { guesstimate } = this.props;
    if (_.isEmpty(guesstimate.description)) {
      return false;
    }
    return (
      <ToolTip>
        <div
          onMouseDown={(e) => {
            e.stopPropagation();
          }}
        >
          <MarkdownViewer source={guesstimate.description} />
        </div>
      </ToolTip>
    );
  }
}
