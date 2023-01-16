import { NextPage } from "next";

import { Layout } from "~/components/layouts";
import { SpaceShow } from "~/components/spaces/SpaceShow";

const ScratchpadPage: NextPage = () => {
  return (
    <Layout isFluid showFooter={false}>
      <SpaceShow spaceId={5170} />
    </Layout>
  );
};

export default ScratchpadPage;
