import { useRouter } from "next/router";
import React, { useEffect } from "react";

import { user } from "gEngine/engine";
import { useAppDispatch, useAppSelector } from "gModules/hooks";
import * as meActions from "gModules/me/actions";
import PageBase from "../base/index";

const content = `
# Redirection 

## You are being redirected.
`;

const AuthRedirect: React.FC = () => {
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

export default AuthRedirect;
