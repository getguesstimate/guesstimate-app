import React, { PropsWithChildren } from "react";

import { FirstSubscriptionContainer } from "~/components/subscriptions/FirstSubscription/container";
import { Container } from "~/components/utility/Container";
import * as displayErrorsActions from "~/modules/displayErrors/actions";
import { useAppDispatch, useAppSelector } from "~/modules/hooks";
import { Plan } from "~/lib/config/plan";
import { capitalizeFirstLetter } from "~/lib/string";
import * as meActions from "~/modules/me/actions";
import { H2 } from "./FirstSubscription/H2";

type Props = {
  planName: string;
};

export const FirstSubscriptionPage: React.FC<Props> = ({ planName }) => {
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
      <div className="font-lato mt-8 mb-16">
        <div className="md:flex gap-18 mx-auto max-w-4xl">
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
            <div className=" max-w-xs p-4 rounded-sm text-grey-666 bg-grey-5">
              <h3 className="text-grey-2">Privacy</h3>
              <p>
                We will not sell or distribute your contact information. Read
                our Privacy Policy.
              </p>

              <h3 className="text-grey-2">Cancellations</h3>
              <p>You cancel at any time with our payment portal.</p>
            </div>
          </div>
          <div className="flex-1">
            {me.id ? (
              planId ? (
                <FirstSubscriptionContainer planId={planId} />
              ) : (
                <H2>Plan Invalid</H2>
              )
            ) : (
              <H2>
                <a href="" onClick={() => meActions.signIn()}>
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
