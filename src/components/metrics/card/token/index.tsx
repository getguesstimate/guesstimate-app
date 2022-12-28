import React from "react";

import Icon from "gComponents/react-fa-patched";

export const MetricReadableId: React.FC<{ readableId: string }> = ({
  readableId,
}) => <div className="ui label green tiny">{readableId}</div>;

export const MetricReasoningIcon: React.FC = () => (
  <span className="hover-hide hover-icon">
    <Icon name="comment" />
  </span>
);
export const MetricSidebarToggle: React.FC<{ onToggleSidebar(): void }> = ({
  onToggleSidebar,
}) => (
  <span
    className="hover-toggle hover-icon"
    onMouseDown={onToggleSidebar}
    data-select="false"
  >
    <Icon name="cog" data-control-sidebar="true" />
  </span>
);

export const MetricExportedIcon: React.FC = () => (
  <div className="MetricToken--Corner">
    <div className="MetricToken--Corner-Triangle"></div>
    <div className="MetricToken--Corner-Item">
      <i className="ion-ios-redo" />
    </div>
  </div>
);
