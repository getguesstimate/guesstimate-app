import { useEffect, useRef } from "react";

import _ from "lodash";
import { useRouter } from "next/router";
import * as firstSubscriptionActions from "~/modules/first_subscription/actions";
import { subStage } from "~/modules/first_subscription/state_machine";
import { useAppDispatch, useAppSelector } from "~/modules/hooks";
import * as spaceActions from "~/modules/spaces/actions";

import { FirstSubscription } from "./FirstSubscription";

type Props = {
  planId: string;
};

export const FirstSubscriptionContainer: React.FC<Props> = ({ planId }) => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const me = useAppSelector((state) => state.me);
  const firstSubscription = useAppSelector((state) => state.firstSubscription);

  // The profile arrives in two steps; only the second (authenticated) fetch
  // includes plan.id. Wait for it, then decide once.
  const profilePlanId = _.get(me, "profile.plan.id");
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current || !profilePlanId || !me.profile) {
      return;
    }
    initialized.current = true;

    dispatch(firstSubscriptionActions.flowStageReset());
    if (profilePlanId !== "personal_free") {
      // Already on a paid plan: point to the portal instead of fetching a
      // checkout the backend would refuse.
      dispatch(firstSubscriptionActions.flowStageUnnecessary());
    } else {
      dispatch(
        firstSubscriptionActions.fetchIframe({
          user_id: me.profile.id,
          plan_id: planId,
        })
      );
    }
  }, [profilePlanId]);

  if (!me.profile) {
    return null; // shouldn't happen, FirstSubscriptionPage won't render this component if user is not signed in
  }

  const hostedPage = firstSubscription.iframe?.hosted_page;

  const iframeWebsiteName = firstSubscription.iframe?.website_name || "";

  const flowStage = subStage(firstSubscription);

  const paymentAccountPortalUrl = _.get(
    me,
    "profile.account._links.payment_portal.href"
  );

  const handlePaymentSuccess = () => {
    dispatch(
      firstSubscriptionActions.postSynchronization({
        user_id: me.profile?.id,
      })
    );
  };

  const handlePaymentCancel = () =>
    dispatch(firstSubscriptionActions.flowStageCancel());

  const handleNewModel = () => dispatch(spaceActions.create(undefined, router));

  return (
    <FirstSubscription
      flowStage={flowStage}
      paymentAccountPortalUrl={paymentAccountPortalUrl}
      hostedPage={hostedPage}
      iframeWebsiteName={iframeWebsiteName}
      onPaymentSuccess={handlePaymentSuccess}
      onPaymentCancel={handlePaymentCancel}
      onNewModel={handleNewModel}
      isTest={false}
    />
  );
};
