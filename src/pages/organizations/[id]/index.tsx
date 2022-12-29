import { NextPage } from "next";
import { useRouter } from "next/router";

import Layout from "../../../routes/layouts/application/index";
import OrganizationShow from "gComponents/organizations/show/index";

const OrganizationPage: NextPage = () => {
  const router = useRouter();

  const { id } = router.query;
  return (
    <Layout backgroundColor="GREY">
      {id === undefined ? null : (
        <OrganizationShow
          organizationId={id as string}
          key={id as string}
          tab={null}
        />
      )}
    </Layout>
  );
};

export default OrganizationPage;