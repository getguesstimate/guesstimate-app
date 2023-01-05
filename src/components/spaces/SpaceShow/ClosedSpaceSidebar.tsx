import React from "react";

import Icon from "~/components/react-fa-patched";

export const ClosedSpaceSidebar: React.FC<{ onOpen(): void }> = React.memo(
  ({ onOpen }) => {
    return (
      <div className="ClosedSpaceSidebar">
        <div className="ui button blue small open" onClick={onOpen}>
          <Icon name="chevron-right" />
        </div>
      </div>
    );
  }
);
