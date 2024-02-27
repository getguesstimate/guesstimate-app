import { NextPage } from "next";
import { AppLayout } from "~/components/layout";
import { AuthRedirect } from "~/components/pages/AuthRedirect";

const AuthRedirectPage: NextPage = () => {
  if (typeof window === "undefined") {
    return null;
  }
  return (
    <AppLayout>
      <AuthRedirect />
    </AppLayout>
  );
};

export default AuthRedirectPage;
