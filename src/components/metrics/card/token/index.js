import React from "react";

import Icon from "gComponents/react-fa-patched";

export const MetricReadableId = ({ readableId }) => (
  <div className="ui label green tiny">{readableId}</div>
);
export const MetricReasoningIcon = () => (
  <span className="hover-hide hover-icon">
    <Icon name="comment" />
  </span>
);
export const MetricSidebarToggle = ({ onToggleSidebar }) => (
  <span
    className="hover-toggle hover-icon"
    onMouseDown={onToggleSidebar}
    data-select="false"
  >
    <Icon name="cog" data-control-sidebar="true" />
  </span>
);
export const MetricExportedIcon = () => (
  <div className="MetricToken--Corner">
    <div className="MetricToken--Corner-Triangle"></div>
    <div className="MetricToken--Corner-Item">
      <i className="ion-ios-redo" />
    </div>
  </div>
);
