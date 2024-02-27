import { NextPage } from "next";
import { AppLayout } from "~/components/layout";
import { FirstSubscriptionStyleGuide } from "~/components/subscriptions/FirstSubscription/StyleGuide";

const FirstSubscriptionStyleGuidePage: NextPage = () => {
  return (
    <AppLayout>
      <FirstSubscriptionStyleGuide />
    </AppLayout>
  );
};

export default FirstSubscriptionStyleGuidePage;
