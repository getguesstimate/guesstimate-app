import { NextPage } from "next";
import { useRouter } from "next/router";

import Layout from "../../../routes/layouts/application/index";
import OrganizationShow from "gComponents/organizations/show/index";

const OrganizationTabPage: NextPage = () => {
  const router = useRouter();

  const { id, tab } = router.query;
  return (
    <Layout backgroundColor="GREY">
      {id === undefined ? null : (
        <OrganizationShow
          organizationId={id as string}
          key={id as string}
          tab={tab as string}
        />
      )}
    </Layout>
  );
};

export default OrganizationTabPage;
