import { FC } from "react";

import Icon from "~/components/react-fa-patched";

export const MetricReadableId: FC<{ readableId: string }> = ({
  readableId,
}) => (
  <div className="rounded-sm bg-green-1 px-1 py-0.5 text-xs font-semibold text-white">
    {readableId}
  </div>
);

export const MetricReasoningIcon: FC = () => (
  <div className="mr-1 rounded-sm text-blue-5 opacity-60">
    <Icon name="comment" />
  </div>
);
export const MetricSidebarToggle: FC<{ onToggleSidebar(): void }> = ({
  onToggleSidebar,
}) => (
  <div
    className="invisible cursor-pointer rounded-sm px-1.5 py-0.5 text-lg leading-none text-blue-5 hover:bg-grey-2 hover:text-white group-hover/gridcell:visible"
    onMouseDown={onToggleSidebar}
    data-select="false"
  >
    <Icon name="cog" data-control-sidebar="true" />
  </div>
);

export const MetricExportedIcon: FC = () => (
  <div>
    {/* triangle */}
    <div className="absolute top-0 right-0 h-0 w-0 border-t-[36px] border-l-[36px] border-t-[#9fabb3] border-l-transparent" />
    <div className="absolute top-0 right-1 text-xl leading-none text-white">
      <i className="ion-ios-redo" />
    </div>
  </div>
);
