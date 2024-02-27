import { NextPage } from "next";
import { useRouter } from "next/router";
import { AppLayout } from "~/components/layout";
import { SpaceShow } from "~/components/spaces/SpaceShow";

const EmbedModelPage: NextPage = () => {
  const router = useRouter();

  const { id } = router.query;
  return (
    <AppLayout isFluid showFooter={false} embed fullHeight>
      {id === undefined ? null : (
        <SpaceShow spaceId={parseInt(id as string)} embed={true} />
      )}
    </AppLayout>
  );
};

export default EmbedModelPage;
