import _ from "lodash";
import React, { useEffect } from "react";

import { Container } from "~/components/utility/Container";
import { useAppDispatch, useAppSelector } from "~/modules/hooks";
import { CreateOrganizationForm } from "./CreateOrganizationForm";
import { LocalAddMembers } from "./LocalAddMembers";
import { Organization } from "~/lib/engine/organization";

export const CreateOrganizationPageContainer: React.FC = () => {
  const newOrganization = useAppSelector((state) => state.newOrganization);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch({ type: "CLEAR_NEW_ORGANIZATION" });
    return () => {
      dispatch({ type: "CLEAR_NEW_ORGANIZATION" }); // ???
    };
  }, []);

  return <CreateOrganizationPage newOrganization={newOrganization} />;
};

export const CreateOrganizationPage: React.FC<{
  newOrganization?: Organization | {};
}> = ({ newOrganization }) => {
  const newOrganizationCreated = _.has(newOrganization, "id");
  return (
    <Container>
      <div className="CreateOrganization">
        <div className="row">
          <div className="col-md-2" />
          <div className="col-md-8">
            <div className="row Header">
              <div className="col-xs-12">
                {!newOrganizationCreated && (
                  <h1> Step 1: Create an Organization </h1>
                )}
                {!!newOrganizationCreated && <h1> Step 2: Add Members </h1>}
              </div>
            </div>
            {!newOrganizationCreated && <CreateOrganizationForm />}
            {!!newOrganizationCreated && (
              <LocalAddMembers organizationId={newOrganization.id} />
            )}
          </div>
        </div>
      </div>
    </Container>
  );
};
