import { NextPage } from "next";
import { AppLayout } from "~/components/layout";
import { TermsAndConditions } from "~/components/pages/TermsAndConditions";

const TermsPage: NextPage = () => {
  return (
    <AppLayout>
      <TermsAndConditions />
    </AppLayout>
  );
};

export default TermsPage;
