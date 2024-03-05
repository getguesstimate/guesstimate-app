import React, { FC } from "react";

import { useSession } from "next-auth/react";
import { signIn } from "~/lib/auth";
import { user } from "~/lib/engine/engine";
import { useAppSelector } from "~/modules/hooks";

import { MenuLink } from "./MenuLink";
import { NewModelDropdown } from "./NewModelDropdown";
import { OrganizationsDropdown } from "./OrganizationsDropdown";
import { ProfileDropdown } from "./ProfileDropdown";

type Props = {
  userOrganizationMemberships: any;
  organizations: any;
};

export const HeaderRightMenu: FC<Props> = (props) => {
  const { status: sessionStatus } = useSession();
  const me = useAppSelector((state) => state.me);
  const organizations = user.usersOrganizations(
    me,
    props.userOrganizationMemberships,
    props.organizations
  );
  const hasOrganizations = organizations.length > 0;

  if (sessionStatus === "loading") {
    return null;
  }

  if (me.tag === "SIGNED_IN_LOADING_PROFILE") {
    return null; // waiting for data to avoid a flash of unsigned state
  }

  return (
    <div className="flex space-x-4 md:space-x-6">
      {me.tag === "SIGNED_IN" ? (
        <>
          <NewModelDropdown
            profile={me.profile}
            organizations={organizations}
          />
          <MenuLink
            href={`/users/${me.profile.id}`}
            icon={<i className="ion-md-albums" />}
            text="My Models"
          />
          {hasOrganizations && (
            <OrganizationsDropdown organizations={organizations} />
          )}
          <ProfileDropdown profile={me.profile} />
        </>
      ) : (
        <>
          <MenuLink href="/scratchpad" noMobile text="Scratchpad" />
          <MenuLink href="/pricing" noMobile text="Plans" />
          <MenuLink
            href="http://docs.getguesstimate.com/"
            noMobile
            text="Documentation"
          />
          <MenuLink onClick={signIn} text="Sign In" />
          <MenuLink onClick={signIn} text="Sign Up" />
        </>
      )}
    </div>
  );
};
