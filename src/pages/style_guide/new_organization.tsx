import { NextPage } from "next";
import { AppLayout } from "~/components/layout";
import { NewOrganizationStyleGuide } from "~/components/organizations/new/NewOrganizationStyleGuide";

const NewOrganizationStyleGuidePage: NextPage = () => {
  return (
    <AppLayout>
      <NewOrganizationStyleGuide />
    </AppLayout>
  );
};

export default NewOrganizationStyleGuidePage;
