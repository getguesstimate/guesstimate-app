import Layout from "../routes/layouts/application/index";

import SettingsStyleGuide from "gComponents/users/settings/StyleGuide";

const SettingsStyleGuidePage = () => {
  return (
    <Layout options={{ isFluid: true, showFooter: false }}>
      <SettingsStyleGuide />
    </Layout>
  );
};

export default SettingsStyleGuidePage;
