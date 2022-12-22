import { NextPage } from "next";

import Layout from "../routes/layouts/application/index";
import Home from "../routes/home/index";

const IndexPage: NextPage = () => {
  return (
    <Layout isFluid simpleHeader>
      <Home />
    </Layout>
  );
};

export default IndexPage;
