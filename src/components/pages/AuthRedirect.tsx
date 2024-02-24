import React, { FC, useEffect } from "react";

import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { user } from "~/lib/engine/engine";
import { useAppDispatch, useAppSelector } from "~/modules/hooks";
import * as meActions from "~/modules/me/actions";

import { PageBase } from "../utility/PageBase";

const content = `
# Redirection

## You are being redirected.
`;

export const AuthRedirect: FC = () => {
  const router = useRouter();

  const dispatch = useAppDispatch();

  const { data: session } = useSession();

  useEffect(() => {
    if (session) {
      (async () => {
        if (!session.auth0_id_token || !session.auth0_id) {
          // generalError("parseHash Error", { err }); // TODO - dispatch redux error?
          return;
        }
        dispatch(
          meActions.logInWithIdToken({
            sub: session.auth0_id,
            id_token: session.auth0_id_token,
          })
        );
      })();
    }
  }, [session]);

  const me = useAppSelector((state) => state.me);

  useEffect(() => {
    if (me.profile) {
      router.push(user.urlById(me.profile.id));
    }
  }, [me, router]);

  return <PageBase content={content} />;
};
