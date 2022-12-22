import { NextPage } from "next";

import Layout from "../routes/layouts/application/index";
import SpaceShow from "gComponents/spaces/show";

const ScratchpadPage: NextPage = () => {
  return (
    <Layout isFluid showFooter={false}>
      <SpaceShow spaceId={5170} />
    </Layout>
  );
};

export default ScratchpadPage;
