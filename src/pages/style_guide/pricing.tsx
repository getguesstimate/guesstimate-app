import { NextPage } from "next";

import PlansStyleGuide from "gComponents/plans/index/StyleGuide";
import Layout from "../../routes/layouts/application/index";

const PricingStyleGuidePage: NextPage = () => {
  return (
    <Layout options={{}}>
      <PlansStyleGuide />
    </Layout>
  );
};

export default PricingStyleGuidePage;
