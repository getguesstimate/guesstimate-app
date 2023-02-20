import Icon from "~/components/react-fa-patched";
import _ from "lodash";
import React from "react";

import { Card } from "~/components/utility/Card";
import { Plan } from "~/lib/config/plan";
import { HR } from "~/components/utility/HR";

const PlanC: React.FC<{ planId: string | undefined }> = ({ planId }) => (
  <div className="bg-grey-1 px-8 py-4 rounded">
    <h2 className="text-blue-1">{Plan.find(planId).fullName()}</h2>
    <p className="text-grey-2">{Plan.find(planId).number()} Private Models</p>
  </div>
);

const PlanUpgradeButton: React.FC = () => (
  <a className="ui button green large" href="/subscribe/lite">
    <Icon name="rocket" /> Upgrade
  </a>
);

// The portal url only can be clicked once.  Then,we need a new one.
const PortalButton: React.FC<{
  url: string;
  onRefresh?(): void;
}> = ({ url, onRefresh }) => (
  <a
    className="ui button black !bg-grey-2"
    href={url}
    target="_blank"
    onMouseUp={onRefresh}
  >
    Edit Plan & Payment Details
  </a>
);

const PlanUpgradeSection: React.FC<{
  planId: string | undefined;
  portalUrl: string | undefined;
  onRefresh?(): void;
}> = ({ planId, portalUrl, onRefresh }) => {
  const hasPortalUrl = !!portalUrl;
  if (planId === "personal_infinite") {
    return null;
  } else {
    return (
      <div>
        <HR />
        <div className="mt-8 flex flex-col items-center">
          {hasPortalUrl ? (
            <PortalButton url={portalUrl} onRefresh={onRefresh} />
          ) : (
            <PlanUpgradeButton />
          )}
        </div>
      </div>
    );
  }
};

type Props = {
  planId: string | undefined;
  onClose(): void;
  portalUrl?: string;
  onRefresh?(): void;
};

export const Settings: React.FC<Props> = ({
  planId,
  onClose,
  portalUrl,
  onRefresh,
}) => {
  return (
    <div className="Settings">
      {!_.isEmpty(planId) && (
        <div>
          <Card
            headerText="Account"
            onClose={onClose}
            width="normal"
            hasPadding={true}
          >
            <div className="py-8 space-y-8">
              <div>
                <PlanC planId={planId} />
              </div>

              <PlanUpgradeSection
                planId={planId}
                portalUrl={portalUrl}
                onRefresh={onRefresh}
              />
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
