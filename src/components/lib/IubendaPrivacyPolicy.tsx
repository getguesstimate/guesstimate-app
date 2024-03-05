import React, { useEffect } from "react";

const id = 7790420; // TODO - move to constants

export const iubendaHref = `//www.iubenda.com/privacy-policy/${id}`;

export const IubendaPrivacyPolicy: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => {
  return (
    <a
      href={iubendaHref}
      className="iubenda-nostyle no-brand iubenda-embed"
      title="Privacy Policy"
    >
      {children}
    </a>
  );
};
