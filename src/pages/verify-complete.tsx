import { NextPage } from "next";
import { useEffect } from "react";

import { signInSilently } from "~/lib/auth";
import { AppLayout } from "~/components/layout";
import { PageBase } from "~/components/utility/PageBase";

const content = `
# Email confirmed

## Signing you in…
`;

// Target of the Auth0 "verify email" link (the email template's Redirect To).
// After the email is confirmed we must start a *fresh* login so Auth0 re-runs
// the account-linking Action and issues a token under the primary account.
// Just landing on a page reuses the old (pre-verification) session and would
// leave linked accounts unresolved.
const VerifyCompletePage: NextPage = () => {
  if (typeof window === "undefined") {
    return null;
  }

  useEffect(() => {
    signInSilently();
  }, []);

  return (
    <AppLayout>
      <PageBase content={content} />
    </AppLayout>
  );
};

export default VerifyCompletePage;
