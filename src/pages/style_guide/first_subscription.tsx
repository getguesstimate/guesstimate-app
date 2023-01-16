import { NextPage } from "next";

import { Layout } from "~/components/layouts";
import { FirstSubscriptionStyleGuide } from "~/components/subscriptions/FirstSubscription/StyleGuide";

const FirstSubscriptionStyleGuidePage: NextPage = () => {
  return (
    <Layout>
      <FirstSubscriptionStyleGuide />
    </Layout>
  );
};

export default FirstSubscriptionStyleGuidePage;
