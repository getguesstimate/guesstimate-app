import { NextPage } from "next";

import Layout from "../routes/layouts/application/index";
import FAQ from "gComponents/pages/faq/index";

const FAQPage: NextPage = () => {
  return (
    <Layout options={{}}>
      <FAQ />
    </Layout>
  );
};

export default FAQPage;
