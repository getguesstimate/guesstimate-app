import { NextPage } from "next";
import { AppLayout } from "~/components/layout";
import { SpaceShow } from "~/components/spaces/SpaceShow";

const ScratchpadPage: NextPage = () => {
  return (
    <AppLayout isFluid showFooter={false}>
      <SpaceShow spaceId={5170} />
    </AppLayout>
  );
};

export default ScratchpadPage;
