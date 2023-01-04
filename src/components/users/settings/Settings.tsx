import Icon from "~/components/react-fa-patched";
import _ from "lodash";
import React from "react";

import Card from "~/components/utility/card/index";
import Plan from "~/lib/config/plan";

const PlanC: React.FC<{ planId: string | undefined }> = ({ planId }) => (
  <div className="Plan">
    <h2> {Plan.find(planId).fullName()} </h2>
    <p> {`${Plan.find(planId).number()} Private Models`}</p>
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
    className="ui button black portal"
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
    return <div />;
  } else {
    return (
      <div>
        <hr />
        <div className="Settings-Upgrade">
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

const Settings: React.FC<Props> = ({
  planId,
  onClose,
  portalUrl,
  onRefresh,
}) => {
  return (
    <div className="Settings">
      {!_.isEmpty(planId) && (
        <div className="ModalMedium">
          <Card
            headerText="Account"
            onClose={onClose}
            width="normal"
            hasPadding={true}
            shadow={true}
          >
            <div>
              <div className="Settings-Plan">
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
export default Settings;
