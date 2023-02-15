import React from "react";

import Icon from "~/components/react-fa-patched";

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
  <div>
    {/* triangle */}
    <div className="absolute top-0 right-0 w-0 h-0 border-t-[36px] border-t-[#9fabb3] border-l-[36px] border-l-transparent" />
    <div className="text-white absolute top-0 right-1 text-xl leading-none">
      <i className="ion-ios-redo" />
    </div>
  </div>
);
