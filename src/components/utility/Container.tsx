import React from "react";

type Props = {
  children: React.ReactNode;
};

export const Container: React.FC<Props> = ({ children }) => {
  return <div className="GeneralContainer">{children}</div>;
};
