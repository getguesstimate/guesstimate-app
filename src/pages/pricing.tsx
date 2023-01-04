import { NextPage } from "next";

import { Layout } from "~/components/layouts";
import PlanIndex from "~/components/plans/index/container";

const PricingPage: NextPage = () => {
  return (
    <Layout backgroundColor="GREY">
      <PlanIndex />
    </Layout>
  );
};

export default PricingPage;
