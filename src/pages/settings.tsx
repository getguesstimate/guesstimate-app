import { NextPage } from "next";

import { Layout } from "~/components/layouts";
import Settings from "~/components/users/settings/container";

const SettingsPage: NextPage = () => {
  return (
    <Layout>
      <Settings onClose={() => undefined} />
    </Layout>
  );
};

export default SettingsPage;
