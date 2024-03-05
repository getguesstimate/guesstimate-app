import { NextPage } from "next";
import { AppLayout } from "~/components/layout";
import { SettingsContainer } from "~/components/users/settings/SettingsContainer";

const SettingsPage: NextPage = () => {
  return (
    <AppLayout>
      <SettingsContainer onClose={() => undefined} />
    </AppLayout>
  );
};

export default SettingsPage;
