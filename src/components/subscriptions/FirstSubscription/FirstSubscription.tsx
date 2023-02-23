import _ from "lodash";
import React, { PropsWithChildren } from "react";
import { Button } from "~/components/utility/buttons/button";

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

export const Message: React.FC<
  PropsWithChildren<{
    text?: string;
  }>
> = ({ text, children }) => (
  <div className="min-h-[12em] w-full rounded bg-grey-5 px-12 py-8 text-grey-2">
    {text && <H2>{text}</H2>}
    {children}
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
    <div className="mt-4 text-xl">Refresh to try again.</div>
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
    <h1 className="text-3xl">This is a test.</h1>
    <H2>Pretend strongly that there is a payment iframe here</H2>
    <div>iframeUrl: {iframeUrl}</div>
    <div>iframeWebsiteName: {iframeWebsiteName}</div>
    <Button color="red" onClick={onPaymentCancel}>
      Pretend to Cancel
    </Button>
    <Button color="blue" onClick={onPaymentSuccess}>
      Pretend to Pay
    </Button>
  </div>
);

export const SynchronizationStart: React.FC = () => (
  <Message text="Synchronizing..." />
);
export const SynchronizationFailure: React.FC = () => (
  <Message>
    <H2>Synchronization Failed</H2>
    <div className="mt-4 text-xl">Try refreshing the browser.</div>
  </Message>
);
export const SynchronizationSuccess: React.FC<{ onNewModel(): void }> = ({
  onNewModel,
}) => (
  <Message>
    <i className="ion-ios-planet text-[16em] text-grey-2/20" />
    <H2>You now have access to private models!</H2>
    <div className="mt-4">
      <Button size="huge" color="blue" onClick={onNewModel}>
        Create A Private Model
      </Button>
    </div>
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
    <div className="grid max-w-xl place-items-center text-center">
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
