import React from "react";

import FirstSubscriptionContainer from "~/components/subscriptions/FirstSubscription/container";
import Container from "~/components/utility/container/Container";
import * as displayErrorsActions from "~/modules/displayErrors/actions";
import { useAppDispatch, useAppSelector } from "~/modules/hooks";
import Plan from "~/lib/config/plan";
import { capitalizeFirstLetter } from "~/lib/string";

type Props = {
  planName: string;
};

const FirstSubscriptionPage: React.FC<Props> = ({ planName }) => {
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
      <div className="FirstSubscriptionPage">
        <div className="row">
          <div className="col-sm-5 col-sm-offset-1">
            <div className="FirstSubscriptionPage-header">
              <h1> {`The ${capitalizeFirstLetter(planName)} Plan`}</h1>
              <h2>
                {" "}
                <span className="number"> {plan.number()} </span> private models{" "}
              </h2>
            </div>
            <div className="FirstSubscriptionPage-sidebar">
              <h3> Privacy </h3>
              <p>
                {" "}
                We will not sell or distribute your contact information. Read
                our Privacy Policy.
              </p>

              <h3> Cancellations </h3>
              <p> You cancel at any time with our payment portal. </p>
            </div>
          </div>
          <div className="col-sm-5">
            {!!me.id && planId && (
              <FirstSubscriptionContainer planId={planId} />
            )}
            {!!me.id && !planId && <h2> Plan Invalid </h2>}
            {!me.id && <h2> Log in to view this page </h2>}
          </div>
        </div>
      </div>
    </Container>
  );
};

export default FirstSubscriptionPage;
