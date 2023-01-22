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
        isFluid ? "w-full px-12" : "max-w-1200 w-full mx-auto px-4",
        !isBare && "border-b border-grey-1"
      )}
    >
      <div
        className={clsx(
          "flex items-center h-12",
          isBare ? "justify-end" : "justify-between"
        )}
      >
        {!isBare && (
          <a className="block p-1 hover:bg-grey-1 rounded-lg" href={navbarRef}>
            <div className="font-lato text-2xl leading-none hidden md:block text-grey-2">
              Guesstimate
            </div>
            <img className="md:hidden h-8" src={logo} />
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
