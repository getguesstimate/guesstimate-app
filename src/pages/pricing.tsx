import { NextPage } from "next";

import Layout from "../routes/layouts/application/index";
import PlanIndex from "gComponents/plans/index/container";

const PricingPage: NextPage = () => {
  return (
    <Layout options={{ backgroundColor: "GREY" }}>
      <PlanIndex />
    </Layout>
  );
};

export default PricingPage;
