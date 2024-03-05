import { FC, useEffect } from "react";

import { useRouter } from "next/router";
import { user } from "~/lib/engine/engine";
import { useAppSelector } from "~/modules/hooks";

import { PageBase } from "../utility/PageBase";

const content = `
# Redirection

## You are being redirected.
`;

export const AuthRedirect: FC = () => {
  const router = useRouter();

  const me = useAppSelector((state) => state.me);

  useEffect(() => {
    if (me.profile) {
      router.push(user.urlById(me.profile.id));
    }
  }, [me, router]);

  return <PageBase content={content} />;
};
