import { FC, useEffect } from "react";

import { useRouter } from "next/router";
import { user } from "~/lib/engine/engine";
import { useAppSelector } from "~/modules/hooks";

import { PageBase } from "../utility/PageBase";

const content = `
# Redirection

## You are being redirected.
`;

const verifyEmailContent = `
# Please confirm your email

## We sent you a confirmation link.

Check your inbox and click the link to verify your email address, then
sign in again. If you signed up with the same email as a Google or GitHub
login, your accounts will be linked automatically once confirmed.
`;

export const AuthRedirect: FC = () => {
  const router = useRouter();

  const me = useAppSelector((state) => state.me);

  useEffect(() => {
    if (me.profile) {
      router.push(user.urlById(me.profile.id));
    }
  }, [me, router]);

  if (me.tag === "SIGNED_IN_NO_PROFILE") {
    return <PageBase content={verifyEmailContent} />;
  }

  return <PageBase content={content} />;
};
