import _ from "lodash";
import React from "react";

import { MarkdownViewer } from "~/components/utility/markdown-viewer/index";
import { ToolTip } from "~/components/utility/ToolTip";

export const MetricToolTip: React.FC<{ guesstimate: any }> = ({
  guesstimate,
}) => {
  if (_.isEmpty(guesstimate.description)) {
    return null;
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
};
