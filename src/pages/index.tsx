import { NextPage } from "next";

import { Layout } from "~/components/layouts";
import { Home } from "../routes/home/index";

const IndexPage: NextPage = () => {
  return (
    <Layout isFluid simpleHeader>
      <Home />
    </Layout>
  );
};

export default IndexPage;
