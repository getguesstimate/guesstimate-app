import _ from "lodash";
import { useRouter } from "next/router";
import { useEffect } from "react";

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

  useEffect(() => {
    dispatch(firstSubscriptionActions.flowStageReset());

    if (me.profile?.has_payment_account) {
      dispatch(
        firstSubscriptionActions.fetchIframe({
          user_id: me.profile.id,
          plan_id: planId,
        })
      );
    }
  }, []);

  if (!me.profile) {
    return null; // shouldn't happen, FirstSubscriptionPage won't render this component if user is not signed in
  }

  const iframeUrl = firstSubscription.iframe?.href || "";

  const iframeWebsiteName = firstSubscription.iframe?.website_name || "";

  const flowStage = subStage(firstSubscription);

  const paymentAccountPortalUrl = _.get(me, "profile.account._links.account");

  const handlePaymentSuccess = () => {
    dispatch(
      firstSubscriptionActions.postSynchronization({
        user_id: me.profile?.id,
      })
    );
  };

  const handlePaymentCancel = () => {
    dispatch(firstSubscriptionActions.flowStageCancel());
  };

  const handleNewModel = () => {
    dispatch(spaceActions.create(undefined, router));
  };

  return (
    <FirstSubscription
      flowStage={flowStage}
      paymentAccountPortalUrl={paymentAccountPortalUrl}
      iframeUrl={iframeUrl}
      iframeWebsiteName={iframeWebsiteName}
      onPaymentSuccess={handlePaymentSuccess}
      onPaymentCancel={handlePaymentCancel}
      onNewModel={handleNewModel}
      isTest={false}
    />
  );
};
