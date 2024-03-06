import { FC, PropsWithChildren, useEffect, useState } from "react";

import { signOut, useSession } from "next-auth/react";
import { useAppDispatch } from "~/modules/hooks";
import * as meActions from "~/modules/me/actions";

export const AuthProvider: FC<PropsWithChildren> = ({ children }) => {
  const { status: sessionStatus, data: session } = useSession();
  const dispatch = useAppDispatch();
  const [reduxConfigured, setReduxConfigured] = useState(false);

  useEffect(() => {
    if (sessionStatus === "loading") {
      return;
    }

    // Force sign out when `session.access_token` is expired.
    // Normally, this should never happen, because we refresh the token in `jwt`
    // callback in next-auth config. But it's a precaution against using stale
    // tokens with the backend, which would result in a confusing UI state.
    if (
      session?.token_expires_at &&
      session.token_expires_at < new Date().getTime() / 1000
    ) {
      signOut();
      return;
    }

    dispatch(meActions.setSession(session));
    setReduxConfigured(true);

    // This exists to help people get their api tokens.
    window.get_profile = () => session;
  }, [session, sessionStatus]);

  // While session is loading, we can't start the app, because `access_token` in
  // Redux is not yet configured.
  // Otherwise Redux might do a request that would fail is the token is not
  // present in its store (since GuesstimateApi is initialized with a token from
  // Redux store.)
  // TODO - this could be improved.
  return reduxConfigured ? children : null;
};
