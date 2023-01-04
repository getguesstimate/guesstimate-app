import { NextPage } from "next";

import { Layout } from "~/components/layouts";
import SpaceIndex from "~/components/spaces/SpacesIndex";

const ModelsPage: NextPage = () => {
  return (
    <Layout backgroundColor="GREY">
      <SpaceIndex />
    </Layout>
  );
};

export default ModelsPage;
