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

    // Force sign out when `session.access_token` is about to expire.
    if (
      session?.token_expires_at &&
      // next-auth reloads the session every 5 minutes, so 10 minute window should be enough.
      session.token_expires_at < new Date().getTime() / 1000 + 600
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
