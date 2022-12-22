import Layout from "../../routes/layouts/application/index";
import { useRouter } from "next/router";

import { CalculatorExpandedShow } from "gComponents/calculators/show/CalculatorExpandedShow";

const CalculatorPage = () => {
  const router = useRouter();

  const { id } = router.query;
  return (
    <Layout options={{ showFooter: false, backgroundColor: "GREY" }}>
      <CalculatorExpandedShow calculatorId={parseInt(id)} key={parseInt(id)} />,
    </Layout>
  );
};

export default CalculatorPage;
