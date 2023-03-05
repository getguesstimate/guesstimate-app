import { useAuth0 } from "@auth0/auth0-react";
import { useRouter } from "next/router";
import React, { useEffect } from "react";

import { user } from "~/lib/engine/engine";
import { useAppDispatch, useAppSelector } from "~/modules/hooks";
import * as meActions from "~/modules/me/actions";
import { PageBase } from "../utility/PageBase";

const content = `
# Redirection

## You are being redirected.
`;

export const AuthRedirect: React.FC = () => {
  const router = useRouter();

  const dispatch = useAppDispatch();

  const { isAuthenticated, getIdTokenClaims, getAccessTokenSilently } =
    useAuth0();
  useEffect(() => {
    if (isAuthenticated) {
      (async () => {
        const token = await getIdTokenClaims();
        // TODO: should use access token instead:
        // const token = await getAccessTokenSilently();
        if (!token) {
          // generalError("parseHash Error", { err }); // TODO - dispatch redux error?
          return;
        }
        dispatch(meActions.logInWithIdToken(token));
      })();
    }
  }, [isAuthenticated, getIdTokenClaims]);

  const me = useAppSelector((state) => state.me);

  useEffect(() => {
    if (me.profile) {
      router.push(user.urlById(me.profile.id));
    }
  }, [me, router]);

  return <PageBase content={content} />;
};
