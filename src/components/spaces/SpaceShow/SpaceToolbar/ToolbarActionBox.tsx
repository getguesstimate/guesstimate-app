import { FC, PropsWithChildren } from "react";

import clsx from "clsx";

export const ToolbarActionBox: FC<
  PropsWithChildren<{
    onClick?(): void;
    disabled?: boolean;
  }>
> = ({ children, onClick, disabled }) => (
  <div
    className={clsx(
      "cursor-pointer select-none rounded-sm px-2 py-1 text-dark-3",
      disabled
        ? "opacity-40 hover:bg-white/20"
        : "hover:bg-white/30 active:bg-white/50"
    )}
    onClick={onClick}
  >
    {children}
  </div>
);
