import { NextPage } from "next";
import { useRouter } from "next/router";

import { Layout } from "~/components/layouts";
import { CalculatorExpandedShow } from "~/components/calculators/show/CalculatorExpandedShow";

const CalculatorPage: NextPage = () => {
  const router = useRouter();

  const { id } = router.query;
  const intId = parseInt(id as string);

  return (
    <Layout showFooter={false} backgroundColor="GREY">
      {id === undefined ? null : (
        <CalculatorExpandedShow calculatorId={intId} key={intId} />
      )}
    </Layout>
  );
};

export default CalculatorPage;
