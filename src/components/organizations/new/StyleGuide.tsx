import React from "react";

import ComponentEditor from "~/components/utility/ComponentEditor/index";

import { CreateOrganizationPage } from "./index";

export const NewOrganizationStyleGuide: React.FC = () => {
  return (
    <div>
      <ComponentEditor
        child={CreateOrganizationPage}
        childProps={{}}
        name="CreateOrganizationPage"
        context="Step 1"
        key="1"
        backgroundColor="grey"
      />
      <ComponentEditor
        child={CreateOrganizationPage}
        childProps={{ newOrganization: { id: 34 } }}
        name="CreateOrganizationPage"
        context="Step 2"
        key="2"
        backgroundColor="grey"
      />
    </div>
  );
};

export default NewOrganizationStyleGuide;
