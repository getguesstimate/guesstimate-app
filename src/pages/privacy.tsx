import { NextPage } from "next";

import Layout from "../routes/layouts/application/index";
import PrivacyPolicy from "gComponents/pages/privacy_policy/index";

const PrivacyPolicyPage: NextPage = () => {
  return (
    <Layout>
      <PrivacyPolicy />
    </Layout>
  );
};

export default PrivacyPolicyPage;
