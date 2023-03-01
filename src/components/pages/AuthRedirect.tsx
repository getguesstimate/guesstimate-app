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
  useEffect(() => {
    dispatch(meActions.logInWithHash(location.hash));
  }, []);

  const me = useAppSelector((state) => state.me);

  useEffect(() => {
    if (me.profile) {
      router.push(user.urlById(me.profile.id));
    }
  }, [me, router]);

  return <PageBase content={content} />;
};
