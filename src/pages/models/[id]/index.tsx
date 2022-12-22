import { NextPage } from "next";
import { useRouter } from "next/router";

import Layout from "../../../routes/layouts/application/index";
import SpaceShow from "gComponents/spaces/show";
import { extractTokenFromUrl } from "gEngine/space";

const ModelPage: NextPage = () => {
  const router = useRouter();

  const { id } = router.query;
  const intId = parseInt(id as string);

  return (
    <Layout options={{ isFluid: true, showFooter: false, fullHeight: true }}>
      {id === undefined ? null : (
        <SpaceShow
          spaceId={intId}
          showCalculatorResults={window.location.search.includes(
            "showResults=true"
          )}
          factsShown={window.location.search.includes("factsShown=true")}
          shareableLinkToken={extractTokenFromUrl(window.location.search)}
          key={intId}
        />
      )}
    </Layout>
  );
};

export default ModelPage;
