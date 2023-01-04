import { NextPage } from "next";

import PlansStyleGuide from "~/components/plans/index/StyleGuide";
import { Layout } from "~/components/layouts";

const PricingStyleGuidePage: NextPage = () => {
  return (
    <Layout>
      <PlansStyleGuide />
    </Layout>
  );
};

export default PricingStyleGuidePage;
