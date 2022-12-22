import { NextPage } from "next";

import Layout from "../routes/layouts/application/index";
import ComponentIndex from "../routes/component-index";

const StyleGuidePage: NextPage = () => {
  return (
    <Layout>
      <ComponentIndex />
    </Layout>
  );
};

export default StyleGuidePage;
