import { PropsWithChildren } from "react";

export const Labeled: React.FC<PropsWithChildren<{ label: string }>> = ({
  label,
  children,
}) => (
  <div className="flex flex-col gap-2">
    <label className="font-bold">{label}</label>
    {children}
  </div>
);
