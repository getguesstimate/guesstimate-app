import { NextPage } from "next";
import { AppLayout } from "~/components/layout";
import { Maintenance } from "~/components/pages/Maintenance";

const MaintenancePage: NextPage = () => {
  return (
    <AppLayout backgroundColor="GREY">
      <Maintenance />
    </AppLayout>
  );
};

export default MaintenancePage;
