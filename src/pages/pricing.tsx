import { NextPage } from "next";

import { Layout } from "~/components/layouts";
import { PlanIndexContainer } from "~/components/plans/index/PlanIndexContainer";

const PricingPage: NextPage = () => {
  return (
    <Layout backgroundColor="GREY">
      <PlanIndexContainer />
    </Layout>
  );
};

export default PricingPage;
