import { NextPage } from "next";
import { useRouter } from "next/router";
import { UserShow } from "~/components/users/UserShow";

const UserPage: NextPage = () => {
  const router = useRouter();

  const { id } = router.query;
  return (
    <>
      {id === undefined ? null : (
        <UserShow key={id as string} userId={parseInt(id as string)} />
      )}
    </>
  );
};

export default UserPage;
