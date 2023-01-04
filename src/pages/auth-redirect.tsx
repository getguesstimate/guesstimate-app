import { NextPage } from "next";

import { Layout } from "~/components/layouts";
import { AuthRedirect } from "~/components/pages/AuthRedirect";

const AuthRedirectPage: NextPage = () => {
  if (typeof window === "undefined") {
    return null;
  }
  return (
    <Layout>
      <AuthRedirect />
    </Layout>
  );
};

export default AuthRedirectPage;
