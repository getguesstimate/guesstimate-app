import React, { FC, ReactNode } from "react";

import clsx from "clsx";

export const MenuLink: FC<{
  href?: string;
  onClick?(): void;
  icon?: ReactNode;
  text: string;
  noMobile?: boolean;
}> = ({ href, onClick, noMobile, icon, text }) => {
  const handleClick = onClick
    ? (e: React.MouseEvent) => {
        e.preventDefault();
        onClick();
      }
    : undefined;

  return (
    <a
      className={clsx(
        "text-grey-2 hover:text-blue-1",
        noMobile ? "hidden md:flex" : "flex",
        "items-center space-x-1 md:space-x-2"
      )}
      href={href ?? ""}
      onClick={handleClick}
    >
      {icon ? <div className="text-xl md:text-2xl">{icon}</div> : null}
      <span className="whitespace-nowrap font-semibold">{text}</span>
    </a>
  );
};
