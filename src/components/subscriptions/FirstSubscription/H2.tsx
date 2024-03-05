import { PropsWithChildren } from "react";

export const H2: React.FC<PropsWithChildren> = ({ children }) => (
  <h2 className="mt-4 text-2xl font-normal text-grey-666">{children}</h2>
);
