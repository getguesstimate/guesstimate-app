import { NextPage } from "next";

import { Layout } from "~/components/layouts";
import { SettingsContainer } from "~/components/users/settings/SettingsContainer";

const SettingsPage: NextPage = () => {
  return (
    <Layout>
      <SettingsContainer onClose={() => undefined} />
    </Layout>
  );
};

export default SettingsPage;
