import localLinks from "local-links";
import { useRouter } from "next/router";
import React, { useCallback, useEffect } from "react";

import { useAppDispatch } from "~/modules/hooks";
import * as modalActions from "~/modules/modal/actions";

type Props = {
  children: React.ReactNode;
};

export const NavHelper: React.FC<Props> = ({ children }) => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const onClick = useCallback((event: React.MouseEvent) => {
    const pathname = localLinks.getLocalPathname(event);

    if (pathname) {
      event.preventDefault();
      router.push(pathname);
      dispatch(modalActions.close());
    }
  }, []);

  useEffect(() => {
    const listener = (e: KeyboardEvent) => {
      if (e.key === "Backspace" && e.target === document.body) {
        e.preventDefault();
      }
    };
    document.addEventListener("keydown", listener);
    return () => document.removeEventListener("keydown", listener);
  }, []);

  return (
    <div className="navHelper" onClick={onClick}>
      {children}
    </div>
  );
};
