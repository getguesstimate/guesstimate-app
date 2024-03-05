import Icon from "~/components/react-fa-patched";
import _ from "lodash";
import React from "react";

import { Card } from "~/components/utility/Card";
import { Plan } from "~/lib/config/plan";
import { HR } from "~/components/utility/HR";
import { Button, ButtonWithIcon } from "~/components/utility/buttons/button";

const PlanC: React.FC<{ planId: string | undefined }> = ({ planId }) => (
  <div className="rounded bg-grey-1 px-8 py-4">
    <header className="text-2xl font-bold text-blue-1">
      {Plan.find(planId).fullName()}
    </header>
    <div className="mt-2 text-grey-2">
      {Plan.find(planId).number()} Private Models
    </div>
  </div>
);

const PlanUpgradeButton: React.FC = () => (
  <a href="/subscribe/lite">
    <ButtonWithIcon
      size="large"
      color="green"
      icon={<Icon name="rocket" />}
      text="Upgrade"
      onClick={() => {}}
    />
  </a>
);

// The portal url only can be clicked once. Then, we need a new one.
const PortalButton: React.FC<{
  url: string;
  onRefresh?(): void;
}> = ({ url, onRefresh }) => (
  <a href={url} target="_blank" onMouseUp={onRefresh}>
    <Button color="dark" size="padded" onClick={() => {}}>
      Edit Plan & Payment Details
    </Button>
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
    <div>
      {!_.isEmpty(planId) && (
        <Card
          headerText="Account"
          onClose={onClose}
          width="normal"
          hasPadding={true}
        >
          <div className="space-y-8 py-8">
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
      )}
    </div>
  );
};
