import { NextPage } from "next";
import { useRouter } from "next/router";

import Layout from "../../../routes/layouts/application/index";
import OrganizationShow from "gComponents/organizations/show/index";

const OrganizationTabPage: NextPage = () => {
  const router = useRouter();

  const { id, tab } = router.query;
  return (
    <Layout options={{ backgroundColor: "GREY" }}>
      <OrganizationShow organizationId={id} key={id as string} tab={tab} />
    </Layout>
  );
};

export default OrganizationTabPage;
