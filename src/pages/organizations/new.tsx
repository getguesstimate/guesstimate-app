import { NextPage } from "next";
import { AppLayout } from "~/components/layout";
import { CreateOrganizationPageContainer } from "~/components/organizations/new/index";

const CreateOrganizationPage: NextPage = () => {
  return (
    <AppLayout backgroundColor="GREY">
      <CreateOrganizationPageContainer />
    </AppLayout>
  );
};

export default CreateOrganizationPage;
