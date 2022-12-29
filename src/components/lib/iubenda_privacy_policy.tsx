import React, { Component } from "react";

export default class IubendaPrivacyPolicy extends Component<{
  id: number;
  children: React.ReactNode;
}> {
  componentWillMount() {
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
  }

  render() {
    const href = "//www.iubenda.com/privacy-policy/" + this.props.id;
    return (
      <a
        href={href}
        className="iubenda-nostyle no-brand iubenda-embed"
        title="Privacy Policy"
      >
        {this.props.children}
      </a>
    );
  }
}
