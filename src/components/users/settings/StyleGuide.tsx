import React from "react";

import ComponentEditor from "gComponents/utility/ComponentEditor/index";
import Plan from "lib/config/plan";
import Settings from "./Settings";

const SettingsStyleGuide: React.FC = () => {
  const planIds = Plan.all().map((e) => e.id);
  return (
    <div className="full-width">
      <div className="row">
        <div className="col-sm-6">
          {planIds.map((planId) => {
            return (
              <ComponentEditor
                child={Settings}
                childProps={{ planId }}
                name="Settings"
                key={planId}
              />
            );
          })}
        </div>
        <div className="col-sm-6">
          {planIds.map((planId) => {
            return (
              <ComponentEditor
                child={Settings}
                childProps={{ planId, portalUrl: "http://google.com" }}
                name="Settings"
                key={planId}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SettingsStyleGuide;
