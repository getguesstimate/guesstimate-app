import Layout from "../../routes/layouts/application/index";

import SpaceIndex from "gComponents/spaces/index/index";

const ModelsPage = () => {
  return (
    <Layout options={{ backgroundColor: "GREY" }}>
      <SpaceIndex />
    </Layout>
  );
};

export default ModelsPage;
