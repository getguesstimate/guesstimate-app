import React from "react";

export const ToolTip: React.FC<{
  children: React.ReactNode;
  size?: "LARGE" | "SMALL";
}> = ({ size = "SMALL", children }) => {
  return (
    <div className={`ToolTip ${size}`}>
      <div className="arrow-up" />
      {children}
    </div>
  );
};
