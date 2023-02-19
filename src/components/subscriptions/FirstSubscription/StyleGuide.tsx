import React, { Component } from "react";

import { ComponentEditor } from "~/components/style_guide/ComponentEditor";
import { subStages } from "~/modules/first_subscription/state_machine";

import { FirstSubscription } from "./FirstSubscription";

const FirstSubscriptionBaseProps = {
  planId: "small",
  paymentAccountPortalUrl: "http://foobar.com",
  iframeUrl: "http://foobar.com",
  iframeWebsiteName: "good-stuff",
  onPaymentCancel: function (g) {
    console.log(g);
  },
  onPaymentSuccess: function (g) {
    console.log(g);
  },
};

function FirstSubscriptionStage(stage) {
  return Object.assign({}, FirstSubscriptionBaseProps, { flowStage: stage });
}

export const FirstSubscriptionStyleGuide: React.FC = () => {
  const flowStage = "UNNECESSARY";
  return (
    <div className="container-fluid full-width">
      {subStages.map((stage) => {
        return (
          <ComponentEditor
            child={FirstSubscription as any}
            childProps={FirstSubscriptionStage(stage)}
            name={stage}
            key={stage}
          />
        );
      })}
    </div>
  );
};
