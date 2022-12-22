import Layout from "../routes/layouts/application/index";

import SpaceShow from "gComponents/spaces/show";

const ScratchpadPage = () => {
  return (
    <Layout
      options={{
        isFluid: true,
        showFooter: false,
      }}
    >
      <SpaceShow spaceId={5170} />
    </Layout>
  );
};

export default ScratchpadPage;
