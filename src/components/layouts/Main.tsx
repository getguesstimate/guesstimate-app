import React from "react";

type Props = {
  isFluid?: boolean;
  backgroundColor?: "BLUE" | "GREY";
  children: React.ReactNode;
};

export const Main: React.FC<Props> = ({
  isFluid = false,
  backgroundColor = "",
  children,
}) => {
  let className = "";
  className += backgroundColor === "BLUE" ? " blue" : "";
  className += backgroundColor === "GREY" ? " grey" : "";
  className += isFluid ? " fluid" : "";

  if (isFluid) {
    return <main className={className}>{children}</main>;
  } else {
    return (
      <main className={className}>
        <div className="wrap">{children}</div>
      </main>
    );
  }
};
