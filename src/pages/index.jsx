import Layout from "../routes/layouts/application/index";

import Home from "../routes/home/index";

const IndexPage = () => {
  return (
    <Layout options={{ isFluid: true, simpleHeader: true }}>
      <Home />
    </Layout>
  );
};

export default IndexPage;
