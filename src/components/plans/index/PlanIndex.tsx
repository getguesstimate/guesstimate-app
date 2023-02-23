import React from "react";

import { Plans } from "./Plans";
import { Container } from "~/components/utility/Container";
import { PlanIndexQuestions } from "./PlanIndexQuestions";
import { Button } from "~/components/utility/buttons/button";

const PortalMessage: React.FC<{ portalUrl: string }> = ({ portalUrl }) => (
  <div className="mx-auto max-w-2xl">
    <div className="flex w-full flex-col items-center rounded bg-white p-4">
      <header className="mb-4 text-2xl font-medium text-grey-main">
        Go to the portal to change plans & payment
      </header>
      <a href={portalUrl} target="_blank">
        <Button size="large" color="blue" onClick={() => {}}>
          Go to Portal
        </Button>
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
      <div className="flex flex-col text-grey-main">
        <div className="text-center">
          <h1 className="mb-8 text-4xl font-medium">Plans & Pricing</h1>
          <h2 className="text-2xl font-light">
            Guesstimate offers unlimited free public models.
            <br />
            Create more private models with a paid plan.
          </h2>
        </div>

        {!!portalUrl && (
          <div className="mt-16">
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
