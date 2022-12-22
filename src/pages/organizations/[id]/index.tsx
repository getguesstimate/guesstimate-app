import { NextPage } from "next";
import { useRouter } from "next/router";

import Layout from "../../../routes/layouts/application/index";
import OrganizationShow from "gComponents/organizations/show/index";

const OrganizationPage: NextPage = () => {
  const router = useRouter();

  const { id } = router.query;
  return (
    <Layout options={{ backgroundColor: "GREY" }}>
      {id === undefined ? null : (
        <OrganizationShow organizationId={id} key={id as string} tab={null} />
      )}
    </Layout>
  );
};

export default OrganizationPage;
