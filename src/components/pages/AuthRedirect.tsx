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
    dispatch(meActions.logIn());
  }, []);

  const me = useAppSelector((state) => state.me);

  useEffect(() => {
    if (me && me.id) {
      router.push(user.urlById(me.id));
    }
  }, [me, router]);

  return (
    <div>
      <PageBase content={content} />
    </div>
  );
};
