import React from "react";

import Icon from "~/components/react-fa-patched";

export const MetricReadableId: React.FC<{ readableId: string }> = ({
  readableId,
}) => (
  <div className="rounded-sm px-1 py-0.5 bg-green-1 text-white text-xs font-semibold">
    {readableId}
  </div>
);

export const MetricReasoningIcon: React.FC = () => (
  <div className="opacity-60 text-blue-5 rounded-sm mr-1">
    <Icon name="comment" />
  </div>
);
export const MetricSidebarToggle: React.FC<{ onToggleSidebar(): void }> = ({
  onToggleSidebar,
}) => (
  <div
    className="invisible group-hover/gridcell:visible px-1.5 py-0.5 rounded-sm text-blue-5 text-lg leading-none hover:bg-grey-2 hover:text-white cursor-pointer"
    onMouseDown={onToggleSidebar}
    data-select="false"
  >
    <Icon name="cog" data-control-sidebar="true" />
  </div>
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
