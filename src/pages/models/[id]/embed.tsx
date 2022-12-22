import { NextPage } from "next";
import { useRouter } from "next/router";

import Layout from "../../../routes/layouts/application/index";
import SpaceShow from "gComponents/spaces/show";

const EmbedModelPage: NextPage = () => {
  const router = useRouter();

  const { id } = router.query;
  return (
    <Layout
      options={{
        isFluid: true,
        showFooter: false,
        embed: true,
        fullHeight: true,
      }}
    >
      <SpaceShow spaceId={parseInt(id as string)} embed={true} />
    </Layout>
  );
};

export default EmbedModelPage;
