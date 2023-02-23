import React from "react";

export const Message: React.FC<{
  title: string;
  children: React.ReactNode;
}> = ({ title, children }) => (
  <div className="rounded border border-grey-ccc bg-white px-6 py-4">
    <header className="mb-2 text-lg font-bold">{title}</header>
    <div className="text-sm">{children}</div>
  </div>
);
