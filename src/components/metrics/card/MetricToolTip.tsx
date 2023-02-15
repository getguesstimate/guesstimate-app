import React from "react";

import { MarkdownViewer } from "~/components/utility/MarkdownViewer";
import { Guesstimate } from "~/modules/guesstimates/reducer";

export const MetricToolTip: React.FC<{ guesstimate: Guesstimate }> = ({
  guesstimate,
}) => {
  if (!guesstimate.description) {
    return null;
  }
  return (
    <div
      onMouseDown={(e) => {
        e.stopPropagation();
      }}
      className="max-w-sm"
    >
      <MarkdownViewer source={guesstimate.description} />
    </div>
  );
};
