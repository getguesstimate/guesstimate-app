import { NextPage } from "next";

import { Layout } from "~/components/layouts";
import { ComponentIndex } from "~/components/style_guide/ComponentIndex";

const StyleGuidePage: NextPage = () => {
  return (
    <Layout>
      <ComponentIndex />
    </Layout>
  );
};

export default StyleGuidePage;
