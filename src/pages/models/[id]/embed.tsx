import { NextPage } from "next";
import { useRouter } from "next/router";
import { EmbeddedModel } from "~/components/embed/EmbeddedModel";
import { extractTokenFromUrl } from "~/lib/engine/space";

const EmbedModelPage: NextPage = () => {
  const router = useRouter();
  const id = Number(router.query.id);
  if (!router.isReady || !Number.isInteger(id) || id <= 0) return null;
  return (
    <EmbeddedModel
      key={id}
      spaceId={id}
      token={extractTokenFromUrl(router.asPath) || null}
    />
  );
};
export default EmbedModelPage;
