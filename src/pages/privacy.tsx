import { NextPage } from "next";
import { AppLayout } from "~/components/layout";
import { PrivacyPolicy } from "~/components/pages/PrivacyPolicy";

const PrivacyPolicyPage: NextPage = () => {
  return (
    <AppLayout>
      <PrivacyPolicy />
    </AppLayout>
  );
};

export default PrivacyPolicyPage;
