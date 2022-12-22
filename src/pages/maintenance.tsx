import { NextPage } from "next";

import Layout from "../routes/layouts/application/index";
import Maintenance from "gComponents/pages/maintenance/index";

const MaintenancePage: NextPage = () => {
  return (
    <Layout options={{}}>
      <Maintenance />
    </Layout>
  );
};

export default MaintenancePage;
