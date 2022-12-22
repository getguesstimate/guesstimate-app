import Layout from "../../../routes/layouts/application/index";
import { useRouter } from "next/router";

import OrganizationShow from "gComponents/organizations/show/index";

const OrganizationPage = () => {
  const router = useRouter();

  const { id } = router.query;
  return (
    <Layout options={{ backgroundColor: "GREY" }}>
      <OrganizationShow organizationId={id} key={id} tab={null} />
    </Layout>
  );
};

export default OrganizationPage;
