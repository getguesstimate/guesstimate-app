import Layout from "../../../routes/layouts/application/index";
import { useRouter } from "next/router";

import OrganizationShow from "gComponents/organizations/show/index";

const OrganizationTabPage = () => {
  const router = useRouter();

  const { id, tab } = router.query;
  return (
    <Layout options={{ backgroundColor: "GREY" }}>
      <OrganizationShow organizationId={id} key={id} tab={tab} />
    </Layout>
  );
};

export default OrganizationTabPage;
