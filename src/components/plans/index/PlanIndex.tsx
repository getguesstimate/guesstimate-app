import React from "react";

import { Plans } from "./Plans";
import { Container } from "~/components/utility/Container";
import { PlanIndexQuestions } from "./PlanIndexQuestions";

const PortalMessage: React.FC<{ portalUrl: string }> = ({ portalUrl }) => (
  <div className="max-w-2xl">
    <div className="bg-white p-4 rounded flex flex-col items-center">
      <h2 className="font-medium mb-4 text-grey-main">
        Go to the portal to change plans & payment
      </h2>
      <a className="ui button large primary" href={portalUrl} target="_blank">
        Go to Portal
      </a>
    </div>
  </div>
);

export type Props = {
  userPlanId: string | undefined; // TODO - stricter type?
  portalUrl?: string;
  isLoggedIn: boolean;
  onChoose: (planId: string) => void;
  onNewOrganizationNavigation: () => void;
};

export const PlanIndex: React.FC<Props> = ({
  userPlanId,
  portalUrl,
  isLoggedIn,
  onChoose,
  onNewOrganizationNavigation,
}) => {
  const showPersonalUpgradeButton =
    userPlanId === "personal_free" && !portalUrl;
  return (
    <Container>
      <div className="PlanIndex font-lato text-grey-main flex flex-col items-center">
        <div className="text-center">
          <h1 className="text-4xl font-medium">Plans & Pricing</h1>
          <h2 className="font-light">
            Guesstimate offers unlimited free public models.
            <br />
            Create more private models with a paid plan.
          </h2>
        </div>

        {!!portalUrl && (
          <div className="mt-8">
            <PortalMessage portalUrl={portalUrl} />
          </div>
        )}

        <div className="mt-24">
          <Plans
            {...{
              showPersonalUpgradeButton,
              isLoggedIn,
              onChoose,
              onNewOrganizationNavigation,
            }}
          />
        </div>

        <div className="mt-32 mb-20">
          <PlanIndexQuestions />
        </div>
      </div>
    </Container>
  );
};
