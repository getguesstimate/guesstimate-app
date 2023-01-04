import { NextPage } from "next";

import { Layout } from "~/components/layouts";
import { NewOrganizationStyleGuide } from "~/components/organizations/new/StyleGuide";

const NewOrganizationStyleGuidePage: NextPage = () => {
  return (
    <Layout>
      <NewOrganizationStyleGuide />
    </Layout>
  );
};

export default NewOrganizationStyleGuidePage;
