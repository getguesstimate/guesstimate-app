import { NextPage } from "next";
import { useRouter } from "next/router";

import Layout from "../../routes/layouts/application/index";
import { CalculatorExpandedShow } from "gComponents/calculators/show/CalculatorExpandedShow";

const CalculatorPage: NextPage = () => {
  const router = useRouter();

  const { id } = router.query;
  const intId = parseInt(id as string);

  return (
    <Layout options={{ showFooter: false, backgroundColor: "GREY" }}>
      <CalculatorExpandedShow calculatorId={intId} key={intId} />
    </Layout>
  );
};

export default CalculatorPage;
