import React, { FC } from "react";

import _ from "lodash";
import { useRouter } from "next/router";
import * as e from "~/lib/engine/engine";
import { useAppSelector } from "~/modules/hooks";

import { PlanIndex } from "./PlanIndex";

export const PlanIndexContainer: FC = () => {
  const router = useRouter();
  const onChoose = (planId: string) => {
    const plan = { personal_lite: "lite", personal_premium: "premium" }[planId];
    router.push(`subscribe/${plan}`);
  };

  const onNewOrganizationNavigation = () => {
    router.push("organizations/new");
  };

  const me = useAppSelector((state) => state.me);

  const portalUrl = _.get(me, "profile.account._links.payment_portal.href");
  const userPlanId = me?.profile?.plan?.id;
  const isLoggedIn = e.me.isLoggedIn(me);

  const props = {
    portalUrl,
    userPlanId,
    isLoggedIn,
    onChoose,
    onNewOrganizationNavigation,
  };

  return <PlanIndex {...props} />;
};
