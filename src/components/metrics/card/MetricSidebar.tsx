import React from "react";
import clsx from "clsx";

import Icon from "~/components/react-fa-patched";

const MetricSidebarItem: React.FC<{
  highlight?: boolean;
  onClick(): void;
  icon: React.ReactElement;
  name: string;
}> = ({ highlight, onClick, icon, name }) => (
  <div
    className={clsx(
      "px-3 py-1.5",
      "border-b border-[#40525c] last:border-0 first:rounded-tr-sm last:rounded-br-sm",
      "cursor-pointer text-white select-none",
      highlight
        ? "bg-[#3d9268] hover:bg-[#2a8558]"
        : "bg-[#52646f] hover:bg-[#40525c]",
      "flex items-center"
    )}
    onMouseDown={onClick}
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

export const MetricSidebar: React.FC<Props> = ({
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
  <div className="absolute top-1 -right-[163px] w-[160px] z-10">
    <MetricSidebarItem
      icon={<Icon name="expand" />}
      name="Expand"
      onClick={onOpenModal}
    />
    {showAnalysis ? (
      <MetricSidebarItem
        highlight={isAnalyzedMetric}
        icon={<Icon name={isAnalyzedMetric ? "close" : "bar-chart"} />}
        name="Sensitivity"
        onClick={isAnalyzedMetric ? onEndAnalysis : onBeginAnalysis}
      />
    ) : null}
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
