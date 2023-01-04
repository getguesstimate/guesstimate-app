import { NextPage } from "next";

import { Layout } from "~/components/layouts";
import { PrivacyPolicy } from "~/components/pages/PrivacyPolicy";

const PrivacyPolicyPage: NextPage = () => {
  return (
    <Layout>
      <PrivacyPolicy />
    </Layout>
  );
};

export default PrivacyPolicyPage;
