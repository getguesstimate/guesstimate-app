import Layout from "../../routes/layouts/application/index";
import { useRouter } from "next/router";

import UserShow from "gComponents/users/show/index";
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
