import _ from "lodash";
import React, { useCallback } from "react";

import { useAppDispatch, useAppSelector } from "gModules/hooks";
import * as meActions from "gModules/me/actions";
import Settings from "./Settings";

type Props = {
  onClose(): void;
};

const SettingsContainer: React.FC<Props> = ({ onClose }) => {
  const dispatch = useAppDispatch();
  const me = useAppSelector((state) => state.me);

  const refreshMe = useCallback(() => {
    dispatch(meActions.guesstimateMeReload());
  }, [dispatch]);

  const portalUrl = _.get(me, "profile.account._links.payment_portal.href");
  const planId = _.get(me, "profile.plan.id");
  return (
    <Settings
      planId={planId}
      portalUrl={portalUrl}
      onClose={onClose}
      onRefresh={refreshMe}
    />
  );
};

export default SettingsContainer;
