import { NextPage } from "next";
import { AppLayout } from "~/components/layout";
import { PlanIndexContainer } from "~/components/plans/index/PlanIndexContainer";

const PricingPage: NextPage = () => {
  return (
    <AppLayout backgroundColor="GREY">
      <PlanIndexContainer />
    </AppLayout>
  );
};

export default PricingPage;
