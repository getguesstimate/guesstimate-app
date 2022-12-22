import { useAppSelector } from "gModules/hooks";
import React from "react";

import Login from "../login";

const logo = "/assets/new-logo-2.png";

const loggedIn = (user) => {
  return !!(user && user.profile && user.profile.name);
};

type Props = {
  isFluid: boolean;
  isBare: boolean;
};

const Header: React.FC<Props> = ({ isFluid, isBare }) => {
  const me = useAppSelector((state) => state.me);
  const organizations = useAppSelector((state) => state.organizations);
  const userOrganizationMemberships = useAppSelector(
    (state) => state.userOrganizationMemberships
  );

  const isLoggedIn = loggedIn(me);
  let className = "PageHeader";
  className += isBare ? " isBare" : "";

  const containerName = isFluid ? "container-fluid" : "wrap";

  let navbarRef = isLoggedIn ? "/models" : "/";
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

          <Login
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

export default Header;
