import { NextPage } from "next";
import { useRouter } from "next/router";
import { OrganizationShow } from "~/components/organizations/show/index";

const OrganizationPage: NextPage = () => {
  const router = useRouter();

  const { id } = router.query;
  return (
    <>
      {id === undefined ? null : (
        <OrganizationShow
          organizationId={parseInt(id as string)}
          key={id as string}
          tab={null}
        />
      )}
    </>
  );
};

export default OrganizationPage;
