import _ from "lodash";
import React from "react";

import { H2 } from "./H2";
import { NewOrder } from "./NewOrder";

type Props = {
  flowStage: string;
  iframeUrl: string;
  iframeWebsiteName: string;
  onPaymentCancel(): void;
  onPaymentSuccess(): void;
  paymentAccountPortalUrl?: string;
  isTest?: boolean;
  onNewModel(): void;
};

export const Message: React.FC<{
  text?: string;
  children?: React.ReactNode;
}> = ({ text, children }) => (
  <div className="bg-grey-5 w-full min-h-[12em] text-grey-2 px-12 py-8 rounded">
    {text && <H2>{text}</H2>}
    {children && children}
  </div>
);

export const Unnecessary: React.FC<{ paymentAccountPortalUrl: string }> = ({
  paymentAccountPortalUrl,
}) => (
  <Message>
    <H2>Go to your portal to edit your plan</H2>
    <a href={paymentAccountPortalUrl} className="ui button blue huge mt-8">
      Portal
    </a>
  </Message>
);

export const Cancelled: React.FC = () => (
  <Message>
    <H2>Payment Cancelled.</H2>
    <h3>Refresh to try again.</h3>
  </Message>
);

export const FormStart: React.FC = () => <Message text="Loading..." />;
export const FormFailure: React.FC = () => (
  <Message text="The form failed loading. Try again soon." />
);
export const FormSuccess: React.FC<
  Pick<
    Props,
    "iframeUrl" | "iframeWebsiteName" | "onPaymentCancel" | "onPaymentSuccess"
  >
> = ({ iframeUrl, iframeWebsiteName, onPaymentCancel, onPaymentSuccess }) => (
  <NewOrder
    page={iframeUrl}
    name={iframeWebsiteName}
    onSuccess={onPaymentSuccess}
    onCancel={onPaymentCancel}
  />
);
export const TestFormSuccess: React.FC<
  Pick<
    Props,
    "iframeUrl" | "iframeWebsiteName" | "onPaymentCancel" | "onPaymentSuccess"
  >
> = ({ iframeUrl, iframeWebsiteName, onPaymentCancel, onPaymentSuccess }) => (
  <div>
    <h1>This is a test.</h1>
    <H2>Pretend strongly that there is a payment iframe here</H2>
    <h3>iframeUrl: {iframeUrl}</h3>
    <h3>iframeWebsiteName: {iframeWebsiteName}</h3>
    <a className="ui button red" onClick={onPaymentCancel}>
      {" "}
      Pretend to Cancel{" "}
    </a>
    <a className="ui button blue" onClick={onPaymentSuccess}>
      {" "}
      Pretend to Pay{" "}
    </a>
  </div>
);

export const SynchronizationStart: React.FC = () => (
  <Message text="Synchronizing..." />
);
export const SynchronizationFailure: React.FC = () => (
  <Message>
    <H2>Synchronization Failed</H2>
    <h3>Try refreshing the browser</h3>
  </Message>
);
export const SynchronizationSuccess: React.FC<{ onNewModel(): void }> = ({
  onNewModel,
}) => (
  <Message>
    <i className="ion-ios-planet text-[18em] text-grey-2/20" />
    <H2>You now have access to private models!</H2>
    <a className="ui button blue huge !mt-8 block" onClick={onNewModel}>
      Create A Private Model
    </a>
  </Message>
);

export const FirstSubscription: React.FC<Props> = (originalProps) => {
  const props = _.defaults(originalProps, {
    iframeUrl: "",
    iframeWebsiteName: "",
    paymentAccountPortalUrl: "",
    isTest: true,
  });
  const {
    flowStage,
    onNewModel,
    isTest,
    iframeUrl,
    iframeWebsiteName,
    onPaymentCancel,
    onPaymentSuccess,
    paymentAccountPortalUrl,
  } = props;

  const formSuccessProps = {
    iframeUrl,
    iframeWebsiteName,
    onPaymentCancel,
    onPaymentSuccess,
  };

  return (
    <div className="grid place-items-center text-center max-w-xl">
      {flowStage === "UNNECESSARY" && (
        <Unnecessary {...{ paymentAccountPortalUrl }} />
      )}
      {flowStage === "CANCELLED" && <Cancelled />}
      {flowStage === "START" && <FormStart />}
      {flowStage === "FORM_START" && <FormStart />}
      {flowStage === "FORM_FAILURE" && <FormFailure />}
      {flowStage === "FORM_SUCCESS" &&
        (isTest ? (
          <TestFormSuccess {...formSuccessProps} />
        ) : (
          <FormSuccess {...formSuccessProps} />
        ))}
      {flowStage === "SYNCHRONIZATION_START" && <SynchronizationStart />}
      {flowStage === "SYNCHRONIZATION_SUCCESS" && (
        <SynchronizationSuccess onNewModel={onNewModel} />
      )}
      {flowStage === "SYNCHRONIZATION_FAILURE" && <SynchronizationFailure />}
    </div>
  );
};
