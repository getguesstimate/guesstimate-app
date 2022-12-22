import Layout from "../routes/layouts/application/index";

import Home from "../routes/home/index";
import { NextPage } from "next";

const IndexPage: NextPage = () => {
  return (
    <Layout options={{ isFluid: true, simpleHeader: true }}>
      <Home />
    </Layout>
  );
};

export default IndexPage;
