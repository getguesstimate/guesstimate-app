import { NextPage } from "next";

import { Layout } from "~/components/layouts";
import { SpacesIndex } from "~/components/spaces/SpacesIndex";

const ModelsPage: NextPage = () => {
  return (
    <Layout backgroundColor="GREY">
      <SpacesIndex />
    </Layout>
  );
};

export default ModelsPage;
