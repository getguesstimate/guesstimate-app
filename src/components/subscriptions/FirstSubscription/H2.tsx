import { PropsWithChildren } from "react";

export const H2: React.FC<PropsWithChildren> = ({ children }) => (
  <h2 className="text-grey-666 font-normal mt-2">{children}</h2>
);
