import { NextPage } from "next";
import { AppLayout } from "~/components/layout";
import { SettingsStyleGuide } from "~/components/users/settings/SettingsStyleGuide";

const SettingsStyleGuidePage: NextPage = () => {
  return (
    <AppLayout isFluid showFooter={false}>
      <SettingsStyleGuide />
    </AppLayout>
  );
};

export default SettingsStyleGuidePage;
