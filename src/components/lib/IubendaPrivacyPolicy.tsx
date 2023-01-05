import React, { useEffect } from "react";

export const IubendaPrivacyPolicy: React.FC<{
  id: number;
  children: React.ReactNode;
}> = ({ id, children }) => {
  useEffect(() => {
    const loadIubenda = function (w, d) {
      const loader = () => {
        const s = d.createElement("script");
        const tag = d.getElementsByTagName("script")[0];
        s.src = "//cdn.iubenda.com/iubenda.js";
        tag.parentNode.insertBefore(s, tag);
      };
      if (w.addEventListener) {
        w.addEventListener("load", loader, false);
      } else if (w.attachEvent) {
        w.attachEvent("onload", loader);
      } else {
        w.onload = loader;
      }
    };
    loadIubenda(window, document);
  }, []);

  const href = `//www.iubenda.com/privacy-policy/${id}`;
  return (
    <a
      href={href}
      className="iubenda-nostyle no-brand iubenda-embed"
      title="Privacy Policy"
    >
      {children}
    </a>
  );
};
