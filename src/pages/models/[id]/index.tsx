import { NextPage } from "next";
import { useRouter } from "next/router";
import { ScratchpadWorkspace } from "~/components/workspace/ScratchpadWorkspace";
import { NavHelper } from "~/components/utility/NavHelper";
import { extractTokenFromUrl } from "~/lib/engine/space";

const ModelPage: NextPage = () => {
  const router = useRouter();

  const { id } = router.query;
  const intId = parseInt(id as string);

  return !router.isReady || !Number.isFinite(intId) ? null : (
    <NavHelper>
      <ScratchpadWorkspace
        key={intId}
        spaceId={intId}
        factsShown={router.query.factsShown === "true"}
        shareableLinkToken={extractTokenFromUrl(window.location.search)}
      />
    </NavHelper>
  );
};

export default ModelPage;
