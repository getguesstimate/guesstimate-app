import Layout from "../../routes/layouts/application/index";
import { useRouter } from "next/router";

import UserShow from "gComponents/users/show/index";
import { NextPage } from "next";

const UserPage: NextPage = () => {
  const router = useRouter();

  const { id } = router.query;
  return (
    <Layout options={{ backgroundColor: "GREY" }}>
      <UserShow userId={id} />
    </Layout>
  );
};

export default UserPage;
