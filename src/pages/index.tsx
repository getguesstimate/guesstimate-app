import { NextPage } from "next";

import { Layout } from "~/components/layouts";
import { Home } from "~/components/pages/Home";

const IndexPage: NextPage = () => {
  return (
    <Layout isFluid simpleHeader>
      <Home />
    </Layout>
  );
};

export default IndexPage;
