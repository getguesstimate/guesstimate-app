import React, { PropsWithChildren } from "react";

export const Container: React.FC<PropsWithChildren> = ({ children }) => {
  return <div className="mt-8 mb-4 md:mt-16 md:mb-8">{children}</div>;
};
