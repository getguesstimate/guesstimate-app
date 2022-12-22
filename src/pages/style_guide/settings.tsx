import { NextPage } from "next";

import Layout from "../../routes/layouts/application/index";
import SettingsStyleGuide from "gComponents/users/settings/StyleGuide";

const SettingsStyleGuidePage: NextPage = () => {
  return (
    <Layout options={{ isFluid: true, showFooter: false }}>
      <SettingsStyleGuide />
    </Layout>
  );
};

export default SettingsStyleGuidePage;
