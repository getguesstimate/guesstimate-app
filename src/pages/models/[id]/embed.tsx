import { NextPage } from "next";
import { useRouter } from "next/router";

import { Layout } from "~/components/layouts";
import { SpaceShow } from "~/components/spaces/SpaceShow";

const EmbedModelPage: NextPage = () => {
  const router = useRouter();

  const { id } = router.query;
  return (
    <Layout isFluid showFooter={false} embed fullHeight>
      {id === undefined ? null : (
        <SpaceShow spaceId={parseInt(id as string)} embed={true} />
      )}
    </Layout>
  );
};

export default EmbedModelPage;
