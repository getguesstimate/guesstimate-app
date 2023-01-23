import React from "react";

export const Message: React.FC<{
  title: string;
  children: React.ReactNode;
}> = ({ title, children }) => (
  <div className="border border-grey-ccc rounded px-6 py-4 bg-white">
    <h3>{title}</h3>
    <div className="text-sm">{children}</div>
  </div>
);
