import Layout from "../routes/layouts/application/index";

import AuthRedirect from "gComponents/pages/auth-redirect/index";

const AuthRedirectPage = () => {
  if (typeof window === "undefined") {
    return null;
  }
  return (
    <Layout options={{ isFluid: true, simpleHeader: true }}>
      <AuthRedirect location={window.location} />
    </Layout>
  );
};

export default AuthRedirectPage;
