import _ from "lodash";
import { useRouter } from "next/router";
import React from "react";

import { PlanIndex } from "./PlanIndex";

import * as e from "gEngine/engine";
import { useAppSelector } from "gModules/hooks";

const PlanIndexContainer: React.FC = () => {
  const router = useRouter();
  const _onChoose = (planId: string) => {
    const plan = { personal_lite: "lite", personal_premium: "premium" }[planId];
    router.push(`subscribe/${plan}`);
  };

  const _onNewOrganizationNavigation = () => {
    router.push(`organizations/new`);
  };

  const me = useAppSelector((state) => state.me);

  const portalUrl = _.get(me, "profile.account._links.payment_portal.href");
  const userPlanId = me?.profile?.plan?.id;
  const isLoggedIn = e.me.isLoggedIn(me);

  const props = {
    portalUrl,
    userPlanId,
    isLoggedIn,
    onChoose: _onChoose,
    onNewOrganizationNavigation: _onNewOrganizationNavigation,
  };

  return <PlanIndex {...props} />;
};

export default PlanIndexContainer;
