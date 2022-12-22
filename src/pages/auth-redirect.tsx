import { NextPage } from "next";

import Layout from "../routes/layouts/application/index";
import AuthRedirect from "gComponents/pages/auth-redirect/index";

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
