import React, { FC, ReactElement } from "react";

import clsx from "clsx";
import Icon from "~/components/react-fa-patched";

const MetricSidebarItem: FC<{
  highlight?: boolean;
  onClick(): void;
  icon: ReactElement;
  name: string;
}> = ({ highlight, onClick, icon, name }) => (
  <div
    className={clsx(
      "px-3 py-1.5",
      "border-b border-accent first:rounded-tr-sm last:rounded-br-sm last:border-0",
      "cursor-pointer select-none text-on-accent",
      highlight
        ? "bg-success hover:bg-success"
        : "bg-accent-solid hover:bg-accent-solid-hover",
      "flex items-center"
    )}
    onMouseUp={onClick}
  >
    <div className="w-6">{icon}</div>
    <div>{name}</div>
  </div>
);

type Props = {
  onOpenModal(): void;
  onRemoveMetric(): void;
  showAnalysis: boolean;
  onBeginAnalysis(): void;
  onEndAnalysis(): void;
  canBeMadeFact: boolean;
  exportedAsFact: boolean;
  onMakeFact(): void;
  isAnalyzedMetric: boolean;
};

export const MetricSidebar: FC<Props> = ({
  onOpenModal,
  onBeginAnalysis,
  onEndAnalysis,
  canBeMadeFact,
  exportedAsFact,
  onMakeFact,
  onRemoveMetric,
  showAnalysis,
  isAnalyzedMetric,
}) => (
  <div>
    <MetricSidebarItem
      icon={<Icon name="expand" />}
      name="Expand"
      onClick={onOpenModal}
    />
    {showAnalysis && (
      <MetricSidebarItem
        highlight={isAnalyzedMetric}
        icon={<Icon name={isAnalyzedMetric ? "close" : "bar-chart"} />}
        name="Sensitivity"
        onClick={isAnalyzedMetric ? onEndAnalysis : onBeginAnalysis}
      />
    )}
    {canBeMadeFact && !exportedAsFact && (
      <MetricSidebarItem
        icon={<i className="ion-ios-redo" />}
        name="Export"
        onClick={onMakeFact}
      />
    )}
    <MetricSidebarItem
      icon={<Icon name="trash" />}
      name="Delete"
      onClick={onRemoveMetric}
    />
  </div>
);
