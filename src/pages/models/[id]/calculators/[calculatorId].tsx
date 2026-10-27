import { NextPage } from "next";
import { useRouter } from "next/router";
import { NavHelper } from "~/components/utility/NavHelper";
import { ModelWorkspace } from "~/components/workspace/ModelWorkspace";
import { extractTokenFromUrl } from "~/lib/engine/space";

const ModelWithCalculatorIdPage: NextPage = () => {
  const router = useRouter();

  const { id, calculatorId } = router.query;
  const intId = parseInt(id as string);
  const intCalculatorId = parseInt(calculatorId as string);

  return (
    <NavHelper>
      {!router.isReady ||
      !Number.isFinite(intId) ||
      !Number.isFinite(intCalculatorId) ? null : (
        <ModelWorkspace
          spaceId={intId}
          initialCalculatorId={intCalculatorId}
          showCalculatorResults={window.location.search.includes(
            "showResults=true"
          )}
          factsShown={window.location.search.includes("factsShown=true")}
          shareableLinkToken={extractTokenFromUrl(window.location.search)}
          key={intId}
        />
      )}
    </NavHelper>
  );
};

export default ModelWithCalculatorIdPage;
