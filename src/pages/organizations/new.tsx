import { NextPage } from "next";

import { Layout } from "~/components/layouts";
import { CreateOrganizationPageContainer } from "~/components/organizations/new/index";

const CreateOrganizationPage: NextPage = () => {
  return (
    <Layout backgroundColor="GREY">
      <CreateOrganizationPageContainer />
    </Layout>
  );
};

export default CreateOrganizationPage;
