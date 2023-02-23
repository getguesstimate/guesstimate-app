import clsx from "clsx";
import React from "react";

type Props = {
  isFluid?: boolean;
  backgroundColor?: "GREY";
  children: React.ReactNode;
};

export const Main: React.FC<Props> = ({
  isFluid = false,
  backgroundColor = "",
  children,
}) => {
  const className = clsx(
    "flex-1",
    backgroundColor === "GREY" && "bg-grey-6",
    isFluid && "flex flex-col"
  );

  if (isFluid) {
    return <main className={className}>{children}</main>;
  } else {
    return (
      <main className={className}>
        <div className="mx-auto w-full max-w-1200">{children}</div>
      </main>
    );
  }
};
