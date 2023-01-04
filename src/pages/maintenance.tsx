import { NextPage } from "next";

import { Layout } from "~/components/layouts";
import { Maintenance } from "~/components/pages/Maintenance";

const MaintenancePage: NextPage = () => {
  return (
    <Layout>
      <Maintenance />
    </Layout>
  );
};

export default MaintenancePage;
