import { NextPage } from "next";

import { Layout } from "~/components/layouts";
import { SettingsStyleGuide } from "~/components/users/settings/SettingsStyleGuide";

const SettingsStyleGuidePage: NextPage = () => {
  return (
    <Layout isFluid showFooter={false}>
      <SettingsStyleGuide />
    </Layout>
  );
};

export default SettingsStyleGuidePage;
