import React, { Component } from "react";

import ComponentEditor from "gComponents/utility/ComponentEditor/index.js";
import Plan from "lib/config/plan.js";
import Settings from "./Settings.js";

export default class SettingsStyleGuide extends Component {
  render() {
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
                  name={"Settings"}
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
                  name={"Settings"}
                  key={planId}
                />
              );
            })}
          </div>
        </div>
      </div>
    );
  }
}
