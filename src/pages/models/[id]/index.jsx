import Layout from "../../../routes/layouts/application/index";
import { useRouter } from "next/router";

import SpaceShow from "gComponents/spaces/show";
import { extractTokenFromUrl } from "gEngine/space";

const ModelPage = () => {
  const router = useRouter();

  const { id } = router.query;
  return (
    <Layout options={{ isFluid: true, showFooter: false, fullHeight: true }}>
      <SpaceShow
        spaceId={parseInt(id)}
        showCalculatorResults={window.location.search.includes(
          "showResults=true"
        )}
        factsShown={window.location.search.includes("factsShown=true")}
        shareableLinkToken={extractTokenFromUrl(window.location.search)}
        key={parseInt(id)}
      />
    </Layout>
  );
};

export default ModelPage;
