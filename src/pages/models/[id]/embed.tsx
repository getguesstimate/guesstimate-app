import { NextPage } from "next";
import { useRouter } from "next/router";

import Layout from "../../../routes/layouts/application/index";
import SpaceShow from "gComponents/spaces/show";

const EmbedModelPage: NextPage = () => {
  const router = useRouter();

  const { id } = router.query;
  return (
    <Layout isFluid showFooter={false} embed fullHeight>
      {id === undefined ? null : (
        <SpaceShow spaceId={String(parseInt(id as string))} embed={true} />
      )}
    </Layout>
  );
};

export default EmbedModelPage;
