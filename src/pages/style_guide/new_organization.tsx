import { NextPage } from "next";

import Layout from "../../routes/layouts/application/index";
import OrganizationNewStyleGuide from "gComponents/organizations/new/StyleGuide";

const NewOrganizationStyleGuidePage: NextPage = () => {
  return (
    <Layout options={{}}>
      <OrganizationNewStyleGuide />
    </Layout>
  );
};

export default NewOrganizationStyleGuidePage;
