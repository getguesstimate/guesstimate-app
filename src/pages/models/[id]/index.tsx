import { NextPage } from "next";
import { useRouter } from "next/router";
import { Layout } from "~/components/layouts";
import { SpaceShow } from "~/components/spaces/SpaceShow";
import { extractTokenFromUrl } from "~/lib/engine/space";

const ModelPage: NextPage = () => {
  const router = useRouter();

  const { id } = router.query;
  const intId = parseInt(id as string);

  return (
    <Layout isFluid showFooter={false} fullHeight>
      {
        // `id` is not available in SSR
        id === undefined ? null : (
          <SpaceShow
            spaceId={intId}
            showCalculatorResults={window.location.search.includes(
              "showResults=true"
            )}
            factsShown={window.location.search.includes("factsShown=true")}
            shareableLinkToken={extractTokenFromUrl(window.location.search)}
            key={intId}
          />
        )
      }
    </Layout>
  );
};

export default ModelPage;
