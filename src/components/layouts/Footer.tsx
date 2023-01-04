import React from "react";

import {
  LinkBlog,
  LinkDocumentation,
  LinkFAQ,
  LinkGithubStar,
  LinkPricing,
  LinkPrivacy,
  LinkTerms,
} from "~/components/utility/links/index";

export const Footer: React.FC = () => {
  return (
    <footer className="gFooter">
      <div className="container-fluid wrap">
        <div className="row">
          <div className="col-sm-2 col-sm-offset-3 col-xs-6">
            <ul>
              <li>
                <strong>Guesstimate</strong>
              </li>
              <li>
                <LinkPricing />
              </li>
              <li>
                <LinkFAQ />
              </li>
              <li>
                <LinkDocumentation />
              </li>
              <li>
                <LinkBlog />
              </li>
            </ul>
          </div>
          <div className="col-sm-2 col-xs-6">
            <ul>
              <li>
                <strong>Legal</strong>
              </li>
              <li>
                <LinkTerms />
              </li>
              <li>
                <LinkPrivacy />
              </li>
            </ul>
          </div>
          <div className="col-sm-2 col-xs-12">
            <LinkGithubStar />
          </div>
        </div>
      </div>
    </footer>
  );
};
