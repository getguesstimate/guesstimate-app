import { NextPage } from "next";

import { PlanStyleGuide } from "~/components/plans/index/StyleGuide";
import { Layout } from "~/components/layouts";

const PricingStyleGuidePage: NextPage = () => {
  return (
    <Layout>
      <PlanStyleGuide />
    </Layout>
  );
};

export default PricingStyleGuidePage;
