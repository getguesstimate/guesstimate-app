import { FC } from "react";

import clsx from "clsx";
import { useSession } from "next-auth/react";
import { useAppSelector } from "~/modules/hooks";

import { HeaderRightMenu } from "./HeaderRightMenu";

const LOGO = "/assets/new-logo-2.png";

type Props = {
  isFluid: boolean;
  isBare: boolean;
};

export const Header: FC<Props> = ({ isFluid, isBare }) => {
  const organizations = useAppSelector((state) => state.organizations);
  const userOrganizationMemberships = useAppSelector(
    (state) => state.userOrganizationMemberships
  );

  const { data: session } = useSession();
  const isLoggedIn = !!session;

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
            <img className="h-8 md:hidden" src={LOGO} />
          </a>
        )}

        <HeaderRightMenu
          organizations={organizations}
          userOrganizationMemberships={userOrganizationMemberships}
        />
      </div>
    </div>
  );
};
