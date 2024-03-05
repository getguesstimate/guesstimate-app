import { NextPage } from "next";
import { AppLayout } from "~/components/layout";
import { PlanStyleGuide } from "~/components/plans/index/StyleGuide";

const PricingStyleGuidePage: NextPage = () => {
  return (
    <AppLayout>
      <PlanStyleGuide />
    </AppLayout>
  );
};

export default PricingStyleGuidePage;
