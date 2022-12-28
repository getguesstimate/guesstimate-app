import { NextPage } from "next";

import Layout from "../routes/layouts/application/index";
import Settings from "gComponents/users/settings/container";

const SettingsPage: NextPage = () => {
  return (
    <Layout>
      <Settings onClose={() => undefined} />
    </Layout>
  );
};

export default SettingsPage;
