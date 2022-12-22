import Layout from "../routes/layouts/application/index";

import PlanIndex from "gComponents/plans/index/container";

const PricingPage = () => {
  return (
    <Layout options={{ backgroundColor: "GREY" }}>
      <PlanIndex />
    </Layout>
  );
};

export default PricingPage;
