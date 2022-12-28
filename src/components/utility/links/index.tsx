import React, { Component } from "react";
import IubendaPrivacyPolicy from "gComponents/lib/iubenda_privacy_policy";
import * as modalActions from "gModules/modal/actions";
import { connect } from "react-redux";

export const LinkFAQ: React.FC = () => <a href="/faq"> FAQ </a>;

export const LinkBlog: React.FC = () => (
  <a href="https://medium.com/guesstimate-blog"> Blog </a>
);

export const LinkDocumentation: React.FC = () => (
  <a href="http://docs.getguesstimate.com/"> Documentation </a>
);

export const LinkTerms: React.FC = () => (
  <a href="/terms"> Terms of Service </a>
);

export const LinkPricing: React.FC = () => <a href="/pricing"> Pricing </a>;

export const LinkPrivacy: React.FC = () => (
  <IubendaPrivacyPolicy id={7790420}>Privacy Policy</IubendaPrivacyPolicy>
);

export const LinkGithubStar: React.FC = () => (
  <iframe
    src="https://ghbtns.com/github-btn.html?user=getguesstimate&repo=guesstimate-app&type=star&count=true"
    frameBorder="0"
    scrolling="0"
    width="160px"
    height="30px"
  ></iframe>
);
