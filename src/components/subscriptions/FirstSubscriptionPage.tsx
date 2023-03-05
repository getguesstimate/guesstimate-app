import React, { PropsWithChildren } from "react";

import { useAuth0 } from "@auth0/auth0-react";

import { Plan } from "~/lib/config/plan";
import { capitalizeFirstLetter } from "~/lib/string";
import * as displayErrorsActions from "~/modules/displayErrors/actions";
import { useAppDispatch, useAppSelector } from "~/modules/hooks";
import * as meActions from "~/modules/me/actions";

import { FirstSubscriptionContainer } from "~/components/subscriptions/FirstSubscription/container";
import { Container } from "~/components/utility/Container";
import { H2 } from "./FirstSubscription/H2";

const Note: React.FC<PropsWithChildren<{ title: string }>> = ({
  title,
  children,
}) => (
  <div>
    <header className="mb-2 text-lg font-bold text-grey-2">{title}</header>
    <p className="text-sm">{children}</p>
  </div>
);

type Props = {
  planName: string;
};

export const FirstSubscriptionPage: React.FC<Props> = ({ planName }) => {
  const { loginWithRedirect } = useAuth0();
  const me = useAppSelector((state) => state.me);
  const dispatch = useAppDispatch();

  if (planName !== "lite" && planName !== "premium") {
    dispatch(
      displayErrorsActions.newError(
        "invalid_plan",
        `Plan ${planName} doesn't exist`
      )
    );
    return null;
  }

  const planId = { lite: "personal_lite", premium: "personal_premium" }[
    planName
  ];

  const plan = Plan.find(planId);
  return (
    <Container>
      <div className="mt-8 mb-16">
        <div className="gap-18 mx-auto max-w-4xl md:flex">
          <div className="flex-1">
            <div className="mb-24">
              <h1 className="text-5xl font-normal text-grey-2">
                The {capitalizeFirstLetter(planName)} Plan
              </h1>
              <H2>
                <span className="text-blue-1">{plan.number()}</span> private
                models
              </H2>
            </div>
            <div className="max-w-xs space-y-4 rounded-sm bg-grey-5 p-4 text-grey-666">
              <Note title="Privacy">
                We will not sell or distribute your contact information. Read
                our Privacy Policy.
              </Note>

              <Note title="Cancellations">
                You cancel at any time with our payment portal.
              </Note>
            </div>
          </div>
          <div className="flex-1">
            {me.profile ? (
              planId ? (
                <FirstSubscriptionContainer planId={planId} />
              ) : (
                <H2>Plan Invalid</H2>
              )
            ) : (
              <H2>
                <a href="" onClick={() => loginWithRedirect()}>
                  Log in
                </a>{" "}
                to view this page
              </H2>
            )}
          </div>
        </div>
      </div>
    </Container>
  );
};
