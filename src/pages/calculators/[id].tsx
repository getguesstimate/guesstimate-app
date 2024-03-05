import { NextPage } from "next";
import { useRouter } from "next/router";
import { CalculatorExpandedShow } from "~/components/calculators/show/CalculatorExpandedShow";
import { AppLayout } from "~/components/layout";

const CalculatorPage: NextPage = () => {
  const router = useRouter();

  const { id } = router.query;
  const intId = parseInt(id as string);

  return (
    <AppLayout showFooter={false} backgroundColor="GREY">
      {id === undefined ? null : (
        <CalculatorExpandedShow calculatorId={intId} key={intId} />
      )}
    </AppLayout>
  );
};

export default CalculatorPage;
