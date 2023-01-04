import { NextPage } from "next";

import { Layout } from "~/components/layouts";
import { FAQ } from "~/components/pages/FAQ";

const FAQPage: NextPage = () => {
  return (
    <Layout>
      <FAQ />
    </Layout>
  );
};

export default FAQPage;
