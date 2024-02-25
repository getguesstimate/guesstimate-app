import { FC } from "react";

import { MarkdownViewer } from "~/components/utility/MarkdownViewer";
import { Guesstimate } from "~/modules/guesstimates/reducer";

export const MetricToolTip: FC<{ guesstimate: Guesstimate }> = ({
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
      className="min-w-[10em] max-w-sm"
    >
      <MarkdownViewer source={guesstimate.description} />
    </div>
  );
};
