import { NextPage } from "next";

import Layout from "../../routes/layouts/application/index";
import SpaceIndex from "gComponents/spaces/index/index";

const ModelsPage: NextPage = () => {
  return (
    <Layout options={{ backgroundColor: "GREY" }}>
      <SpaceIndex />
    </Layout>
  );
};

export default ModelsPage;
