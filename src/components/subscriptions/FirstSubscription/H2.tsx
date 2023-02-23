import { PropsWithChildren } from "react";

export const H2: React.FC<PropsWithChildren> = ({ children }) => (
  <h2 className="text-2xl text-grey-666 font-normal mt-4">{children}</h2>
);
