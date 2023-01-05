import { Layout } from "~/components/layouts";
import { useRouter } from "next/router";

import { UserShow } from "~/components/users/UserShow";
import { NextPage } from "next";

const UserPage: NextPage = () => {
  const router = useRouter();

  const { id } = router.query;
  return (
    <Layout backgroundColor="GREY">
      {id === undefined ? null : <UserShow userId={parseInt(id as string)} />}
    </Layout>
  );
};

export default UserPage;
