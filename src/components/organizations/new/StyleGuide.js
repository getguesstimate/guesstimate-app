import React, { Component } from "react";

import ComponentEditor from "gComponents/utility/ComponentEditor/index";

import { CreateOrganizationPage } from "./index";

export default class PlanStyleGuide extends Component {
  render() {
    return (
      <div className="">
        <ComponentEditor
          child={CreateOrganizationPage}
          childProps={{}}
          name={`CreateOrganizationPage`}
          context={"Step 1"}
          key={"1"}
          backgroundColor={"grey"}
        />
        <ComponentEditor
          child={CreateOrganizationPage}
          childProps={{ newOrganization: { id: 34 } }}
          name={`CreateOrganizationPage`}
          context={"Step 2"}
          key={"2"}
          backgroundColor={"grey"}
        />
      </div>
    );
  }
}
