import _ from "lodash";
import React, { Component } from "react";

import { subStages } from "gModules/first_subscription/state_machine";
import NewOrder from "./NewOrder";

export const SynchronizationSuccess: React.FC<{ onNewModel(): void }> = ({
  onNewModel,
}) => (
  <Message>
    <i className="ion-ios-planet large-icon" />
    <h2>You now have access to private models!</h2>
    <a className="ui button blue huge" onClick={onNewModel}>
      Create A Private Model
    </a>
  </Message>
);

type Props = {
  flowStage: typeof subStages[number];
  planId: string;
  iframeUrl: string;
  iframeWebsiteName: string;
  onPaymentCancel(): void;
  onPaymentSuccess(): void;
  paymentAccountPortalUrl: string;
  isTest?: boolean;
  onNewModel(): void;
};

export default class FirstSubscription extends Component<Props> {
  static defaultProps = {
    iframeUrl: "",
    iframeWebsiteName: "",
    paymentAccountPortalUrl: "",
    isTest: true,
  };

  _formSuccessProps() {
    const neededProps = [
      "iframeUrl",
      "iframeWebsiteName",
      "onPaymentCancel",
      "onPaymentSuccess",
    ] as const;
    return _.pick(this.props, neededProps);
  }

  _unnecessaryProps() {
    const neededProps = ["paymentAccountPortalUrl"] as const;
    return _.pick(this.props, neededProps);
  }

  render() {
    const { flowStage, isTest, onNewModel } = this.props;
    return (
      <div className="FirstSubscription">
        {flowStage === "UNNECESSARY" && (
          <Unnecessary {...this._unnecessaryProps()} />
        )}
        {flowStage === "CANCELLED" && <Cancelled />}
        {flowStage === "START" && <FormStart />}
        {flowStage === "FORM_START" && <FormStart />}
        {flowStage === "FORM_FAILURE" && <FormFailure />}
        {flowStage === "FORM_SUCCESS" && !isTest && (
          <FormSuccess {...this._formSuccessProps()} />
        )}
        {flowStage === "FORM_SUCCESS" && isTest && (
          <TestFormSuccess {...this._formSuccessProps()} />
        )}
        {flowStage === "SYNCHRONIZATION_START" && <SynchronizationStart />}
        {flowStage === "SYNCHRONIZATION_SUCCESS" && (
          <SynchronizationSuccess onNewModel={onNewModel} />
        )}
        {flowStage === "SYNCHRONIZATION_FAILURE" && <SynchronizationFailure />}
      </div>
    );
  }
}

export const TestFormSuccess = ({
  iframeUrl,
  iframeWebsiteName,
  onPaymentCancel,
  onPaymentSuccess,
}) => (
  <div>
    <h1>This is a test.</h1>
    <h2>Pretend strongly that there is a payment iframe here</h2>
    <h3>iframeUrl: {iframeUrl}</h3>
    <h3>iframeWebsiteName: {iframeWebsiteName}</h3>
    <a className="ui button red" onClick={onPaymentCancel}>
      {" "}
      {"Pretend to Cancel"}{" "}
    </a>
    <a className="ui button blue" onClick={onPaymentSuccess}>
      {" "}
      {"Pretend to Pay"}{" "}
    </a>
  </div>
);

export const FormSuccess = ({
  iframeUrl,
  iframeWebsiteName,
  onPaymentCancel,
  onPaymentSuccess,
}) => (
  <div>
    <NewOrder
      page={iframeUrl}
      name={iframeWebsiteName}
      onSuccess={onPaymentSuccess}
      onCancel={onPaymentCancel}
    />
  </div>
);

export const Unnecessary: React.FC<{ paymentAccountPortalUrl: string }> = ({
  paymentAccountPortalUrl,
}) => (
  <Message>
    <h2> Go to your portal to edit your plan</h2>
    <a href={paymentAccountPortalUrl} className="ui button blue huge">
      Portal
    </a>
  </Message>
);

export const Message: React.FC<{
  text?: string;
  children?: React.ReactNode;
}> = ({ text, children }) => (
  <div className="GeneralMessage">
    {text && <h2> {text} </h2>}
    {children && children}
  </div>
);

export const Cancelled = () => (
  <Message>
    <h2>Payment Cancelled.</h2>
    <h3>Refresh to try again.</h3>
  </Message>
);

export const FormStart = () => <Message text="Loading..." />;
export const FormFailure = () => (
  <Message text="The form failed loading.  Try again soon." />
);
export const SynchronizationStart = () => <Message text="Synchronizing..." />;

export const SynchronizationFailure = () => (
  <Message>
    <h2>Synchronization Failed</h2>
    <h3>Try refreshing the browser</h3>
  </Message>
);
