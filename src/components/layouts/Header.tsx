import clsx from "clsx";
import React from "react";

import { useAppSelector } from "~/modules/hooks";
import { RootState } from "~/modules/store";

import { HeaderRightMenu } from "./HeaderRightMenu";

const logo = "/assets/new-logo-2.png";

const loggedIn = (user: RootState["me"]) => {
  return !!(user && user.profile && user.profile.name);
};

type Props = {
  isFluid: boolean;
  isBare: boolean;
};

export const Header: React.FC<Props> = ({ isFluid, isBare }) => {
  const me = useAppSelector((state) => state.me);
  const organizations = useAppSelector((state) => state.organizations);
  const userOrganizationMemberships = useAppSelector(
    (state) => state.userOrganizationMemberships
  );

  const isLoggedIn = loggedIn(me);

  const navbarRef = isLoggedIn ? "/models" : "/";
  return (
    <div
      className={clsx(
        isFluid ? "w-full px-8" : "mx-auto w-full max-w-1200 px-4",
        !isBare && "border-b border-grey-1"
      )}
    >
      <div
        className={clsx(
          "flex h-12 items-center",
          isBare ? "justify-end" : "justify-between"
        )}
      >
        {!isBare && (
          <a className="block rounded-lg p-2 hover:bg-grey-1" href={navbarRef}>
            <div className="hidden text-2xl leading-none text-grey-2 md:block">
              Guesstimate
            </div>
            <img className="h-8 md:hidden" src={logo} />
          </a>
        )}

        <HeaderRightMenu
          me={me}
          organizations={organizations}
          userOrganizationMemberships={userOrganizationMemberships}
          isLoggedIn={isLoggedIn}
        />
      </div>
    </div>
  );
};
