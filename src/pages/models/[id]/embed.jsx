import Layout from "../../../routes/layouts/application/index";
import { useRouter } from "next/router";

import SpaceShow from "gComponents/spaces/show";

const EmbedModelPage = () => {
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
      <SpaceShow spaceId={parseInt(id)} embed={true} />
    </Layout>
  );
};

export default EmbedModelPage;
