import clsx from "clsx";
import React from "react";

export const ToolbarActionBox: React.FC<{
  children: React.ReactNode;
  onClick?(): void;
  disabled?: boolean;
}> = ({ children, onClick, disabled }) => (
  <div
    className={clsx(
      "text-dark-3 cursor-pointer px-2 py-1 rounded-sm select-none",
      disabled
        ? "opacity-40 hover:bg-white/20"
        : "hover:bg-white/30 active:bg-white/50"
    )}
    onClick={onClick}
  >
    {children}
  </div>
);
