import Layout from "../routes/layouts/application/index";

import Settings from "gComponents/users/settings/container";

const SettingsPage = () => {
  return (
    <Layout options={{}}>
      <Settings />
    </Layout>
  );
};

export default SettingsPage;
