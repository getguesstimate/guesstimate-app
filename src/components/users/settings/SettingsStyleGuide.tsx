import React from "react";

import { ComponentEditor } from "~/components/style_guide/ComponentEditor";
import { Plan } from "~/lib/config/plan";
import { Settings } from "./Settings";

export const SettingsStyleGuide: React.FC = () => {
  const planIds = Plan.all().map((e) => e.id);
  return (
    <div className="grid grid-cols-2">
      <div>
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
      <div>
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
  );
};
