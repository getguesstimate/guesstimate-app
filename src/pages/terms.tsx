import { NextPage } from "next";

import Layout from "../routes/layouts/application/index";
import TermsAndConditions from "gComponents/pages/terms_and_conditions/index";

const TermsPage: NextPage = () => {
  return (
    <Layout options={{}}>
      <TermsAndConditions />
    </Layout>
  );
};

export default TermsPage;
