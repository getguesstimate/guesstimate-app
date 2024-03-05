import { NextPage } from "next";
import { AppLayout } from "~/components/layout";
import { SpacesIndex } from "~/components/spaces/SpacesIndex";

const ModelsPage: NextPage = () => {
  return (
    <AppLayout backgroundColor="GREY">
      <SpacesIndex />
    </AppLayout>
  );
};

export default ModelsPage;
