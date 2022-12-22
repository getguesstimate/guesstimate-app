import { NextPage } from "next";

import Layout from "../../routes/layouts/application/index";
import FirstSubscriptionStyleGuide from "gComponents/subscriptions/FirstSubscription/StyleGuide";

const FirstSubscriptionStyleGuidePage: NextPage = () => {
  return (
    <Layout>
      <FirstSubscriptionStyleGuide />
    </Layout>
  );
};

export default FirstSubscriptionStyleGuidePage;
