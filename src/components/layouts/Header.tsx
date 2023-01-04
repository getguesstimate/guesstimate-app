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
  let className = "PageHeader";
  className += isBare ? " isBare" : "";

  const containerName = isFluid ? "container-fluid" : "wrap";

  const navbarRef = isLoggedIn ? "/models" : "/";
  return (
    <div className={className}>
      <div className={containerName}>
        <div className="menu">
          {!isBare && (
            <div className="header-left-menu">
              <a className="navbar-brand" href={navbarRef}>
                <div className="guesstimate-name">Guesstimate</div>
                <img className="guesstimate-icon" src={logo} />
              </a>
            </div>
          )}

          <HeaderRightMenu
            me={me}
            organizations={organizations}
            userOrganizationMemberships={userOrganizationMemberships}
            isLoggedIn={isLoggedIn}
          />
        </div>
      </div>
    </div>
  );
};
