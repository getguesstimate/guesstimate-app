import React from "react";

import { ComponentEditor } from "~/components/utility/ComponentEditor";
import { Plan } from "~/lib/config/plan";
import { Settings } from "./Settings";

export const SettingsStyleGuide: React.FC = () => {
  const planIds = Plan.all().map((e) => e.id);
  return (
    <div className="full-width">
      <div className="row">
        <div className="col-sm-6">
          {planIds.map((planId) => {
            return (
              <ComponentEditor
                child={Settings}
                childProps={{ planId, onClose: () => {} }}
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
                childProps={{
                  planId,
                  portalUrl: "http://google.com",
                  onClose: () => {},
                }}
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
