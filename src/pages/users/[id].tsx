import { NextPage } from "next";
import { useRouter } from "next/router";
import { AppLayout } from "~/components/layout";
import { UserShow } from "~/components/users/UserShow";

const UserPage: NextPage = () => {
  const router = useRouter();

  const { id } = router.query;
  return (
    <AppLayout backgroundColor="GREY">
      {id === undefined ? null : <UserShow userId={parseInt(id as string)} />}
    </AppLayout>
  );
};

export default UserPage;
