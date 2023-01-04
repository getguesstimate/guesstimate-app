import { NextPage } from "next";

import { Layout } from "~/components/layouts";
import { TermsAndConditions } from "~/components/pages/TermsAndConditions";

const TermsPage: NextPage = () => {
  return (
    <Layout>
      <TermsAndConditions />
    </Layout>
  );
};

export default TermsPage;
