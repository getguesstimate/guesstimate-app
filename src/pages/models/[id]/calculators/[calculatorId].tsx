import { NextPage } from "next";
import { useRouter } from "next/router";
import { AppLayout } from "~/components/layout";
import { SpaceShow } from "~/components/spaces/SpaceShow";
import { extractTokenFromUrl } from "~/lib/engine/space";

const ModelWithCalculatorIdPage: NextPage = () => {
  const router = useRouter();

  const { id, calculatorId } = router.query;
  const intId = parseInt(id as string);
  const intCalculatorId = parseInt(calculatorId as string);

  return (
    <AppLayout isFluid showFooter={false} fullHeight>
      {id === undefined ? null : (
        <SpaceShow
          spaceId={intId}
          showCalculatorId={intCalculatorId}
          showCalculatorResults={window.location.search.includes(
            "showResults=true"
          )}
          factsShown={window.location.search.includes("factsShown=true")}
          shareableLinkToken={extractTokenFromUrl(window.location.search)}
          key={intId}
        />
      )}
    </AppLayout>
  );
};

export default ModelWithCalculatorIdPage;
