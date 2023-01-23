import React from "react";

import Icon from "~/components/react-fa-patched";

export const ClosedSpaceSidebar: React.FC<{ onOpen(): void }> = React.memo(
  ({ onOpen }) => {
    return (
      <div className="pl-1 pt-2">
        <div
          className="!p-2 !bg-blue-1 ui button blue small open"
          onClick={onOpen}
        >
          <Icon name="chevron-right" />
        </div>
      </div>
    );
  }
);
