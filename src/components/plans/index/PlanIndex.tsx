import React from "react";

import { Plans } from "./Plans";
import { Container } from "~/components/utility/Container";
import { PlanIndexQuestions } from "./PlanIndexQuestions";

const PortalMessage: React.FC<{ portalUrl: string }> = ({ portalUrl }) => (
  <div className="portal-message-container">
    <div className="portal-message">
      <h2>{"Go to the portal to change plans & payment"}</h2>
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
      <div className="PlanIndex">
        <div className="header">
          <h1>Plans & Pricing</h1>
          <h2>
            Guesstimate offers unlimited free public models.
            <br />
            Create more private models with a paid plan.
          </h2>
        </div>

        {!!portalUrl && <PortalMessage portalUrl={portalUrl} />}

        <div className="cards">
          <Plans
            {...{
              showPersonalUpgradeButton,
              isLoggedIn,
              onChoose,
              onNewOrganizationNavigation,
            }}
          />
        </div>
        <PlanIndexQuestions />
      </div>
    </Container>
  );
};
