import { FC } from "react";

import Icon from "~/components/react-fa-patched";
import { ToolTip } from "~/components/utility/ToolTip";

import { ToolbarActionBox } from "./ToolbarActionBox";

export const ToolbarIcon: FC<{
  tooltipId: string;
  tooltip: string;
  onClick?(): void;
  iconName: string;
  disabled?: boolean;
}> = ({ tooltipId, tooltip, onClick, iconName, disabled }) => {
  return (
    <ToolTip text={tooltip} id={tooltipId}>
      <ToolbarActionBox onClick={onClick} disabled={disabled}>
        <Icon name={iconName} />
      </ToolbarActionBox>
    </ToolTip>
  );
};
