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
      <div className="max-w-[820px] mx-auto">
        <h1 className="mt-4 mb-8 font-medium text-4xl">
          {newOrganizationCreated
            ? "Step 2: Add Members"
            : "Step 1: Create an Organization"}
        </h1>
        {newOrganizationCreated ? (
          <LocalAddMembers organizationId={newOrganization.id} />
        ) : (
          <CreateOrganizationForm />
        )}
      </div>
    </Container>
  );
};
