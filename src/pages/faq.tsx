import { NextPage } from "next";
import { AppLayout } from "~/components/layout";
import { FAQ } from "~/components/pages/FAQ";

const FAQPage: NextPage = () => {
  return (
    <AppLayout>
      <FAQ />
    </AppLayout>
  );
};

export default FAQPage;
