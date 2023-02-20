import _ from "lodash";
import { useRouter } from "next/router";
import React, { useRef } from "react";

import {
  CardListElement,
  CardListElementProps,
} from "~/components/utility/Card";
import { DropDown, DropDownHandle } from "~/components/utility/DropDown";

import * as meActions from "~/modules/me/actions";
import * as modalActions from "~/modules/modal/actions";
import * as navigationActions from "~/modules/navigation/actions";
import * as spaceActions from "~/modules/spaces/actions";

import { organization, user } from "~/lib/engine/engine";
import { useAppDispatch } from "~/modules/hooks";
import { RootState } from "~/modules/store";
import clsx from "clsx";

const MenuLink: React.FC<{
  href?: string;
  onClick?(): void;
  icon?: React.ReactNode;
  text: string;
  noMobile?: boolean;
}> = ({ href, onClick, noMobile, icon, text }) => {
  const handleClick = onClick
    ? (e: React.MouseEvent) => {
        e.preventDefault();
        onClick();
      }
    : undefined;

  return (
    <a
      className={clsx(
        "text-grey-2 hover:text-blue-1",
        noMobile ? "hidden md:flex" : "flex",
        "space-x-1 md:space-x-2 items-center"
      )}
      href={href || ""}
      onClick={handleClick}
    >
      {icon ? <div className="text-xl md:text-2xl">{icon}</div> : null}
      <span className="font-semibold whitespace-nowrap">{text}</span>
    </a>
  );
};

const ProfileDropdown: React.FC<{
  me: RootState["me"];
}> = ({ me }) => {
  const profile: any = me.profile;
  const portalUrl = _.get(profile, "account._links.payment_portal.href");
  const router = useRouter();
  const dispatch = useAppDispatch();

  const openModal = () => {
    dispatch(modalActions.openSettings());
  };

  const logOut = () => {
    dispatch(meActions.logOut());
  };

  let listElements = [
    {
      ionicIcon: "md-person",
      header: "account",
      onMouseDown: openModal,
    },
    {
      icon: "rocket",
      header: "upgrade",
      onMouseDown: () => {
        router.push("/subscribe/lite");
      },
    },
    {
      ionicIcon: "ios-people",
      header: "New Organization",
      onMouseDown: () => {
        router.push("/organizations/new");
      },
    },
    {
      ionicIcon: "md-help",
      header: "Documentation",
      onMouseDown: () => {
        navigationActions.externalNavigate("http://docs.getguesstimate.com/");
      },
    },
    {
      ionicIcon: "ios-chatbubbles",
      header: "Feedback",
      onMouseDown: () => {
        navigationActions.externalNavigate(
          "https://productpains.com/product/guesstimate"
        );
      },
    },
    {
      ionicIcon: "md-log-out",
      header: "Sign Out",
      onMouseDown: logOut,
    },
  ];

  if (!!portalUrl) {
    listElements = listElements.filter((e) => e.header !== "upgrade");
  }

  return (
    <DropDown
      headerText={profile.name}
      openLink={
        <img
          className="w-8 rounded-full outline outline-4 outline-transparent hover:outline-grey-1"
          src={profile.picture}
        />
      }
    >
      {listElements.map((props) => (
        <CardListElement {...props} key={props.header} closeOnClick={true} />
      ))}
    </DropDown>
  );
};

const NewModelDropdown: React.FC<{
  me: RootState["me"];
  organizations: any;
}> = ({ me, organizations }) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const ref = useRef<DropDownHandle | null>(null);
  const userPic = me.profile?.picture;
  const userName = me.profile?.name;

  const createModel = (organizationId: number | undefined) => {
    dispatch(spaceActions.create(organizationId, router));
  };

  const personalModel: CardListElementProps = {
    header: userName!,
    imageShape: "circle" as const,
    onMouseDown: () => {
      createModel(undefined);
      ref.current?.close();
    },
  };
  if (userPic) {
    personalModel.image = userPic;
  } else {
    personalModel.icon = "user";
  }

  let listElements = [{ props: personalModel, id: "me" }];
  if (organizations) {
    listElements = listElements.concat(
      organizations.map((o) => ({
        props: {
          header: o.name,
          imageShape: "circle" as const,
          image: o.picture,
          onMouseDown: () => {
            createModel(o.id);
            ref.current?.close();
          },
        },
        id: o.id,
      }))
    );
  }

  if (!organizations?.length) {
    return (
      <MenuLink
        onClick={() => {
          createModel(undefined);
        }}
        noMobile
        text="New Model"
        icon={<i className="ion-md-add" />}
      />
    );
  }

  return (
    <DropDown
      headerText="Select Owner"
      openLink={
        <MenuLink
          noMobile
          icon={<i className="ion-md-add" />}
          text="New Model"
        />
      }
      ref={ref}
    >
      {listElements.map((element) => (
        <CardListElement {...element.props} key={element.id} />
      ))}
    </DropDown>
  );
};

const OrganizationsDropdown: React.FC<{
  organizations: any[];
}> = ({ organizations }) => {
  const router = useRouter();

  const ref = useRef<DropDownHandle | null>(null);

  let listElements: { props: CardListElementProps; id: string }[] = [];

  if (organizations) {
    listElements = organizations.map((o) => ({
      props: {
        header: String(o.name),
        imageShape: "circle",
        image: organization.image(o),
        onMouseDown: () => {
          router.push(organization.url(o));
          ref.current?.close();
        },
      },
      id: o.id,
    }));
  }

  return (
    <DropDown
      headerText="Organizations"
      openLink={
        <MenuLink
          icon={<i className="ion-ios-people" />}
          text="Organizations"
        />
      }
      ref={ref}
    >
      {listElements.map((element) => (
        <CardListElement {...element.props} key={element.id} />
      ))}
    </DropDown>
  );
};

type Props = {
  me: RootState["me"];
  isLoggedIn: boolean;
  userOrganizationMemberships: any;
  organizations: any;
};

export const HeaderRightMenu: React.FC<Props> = (props) => {
  const signUp = () => {
    meActions.signUp();
  };

  const signIn = () => {
    meActions.signIn();
  };

  const { me, isLoggedIn } = props;

  const organizations = user.usersOrganizations(
    props.me,
    props.userOrganizationMemberships,
    props.organizations
  );
  const hasOrganizations = organizations.length > 0;

  return (
    <div className="flex space-x-4 md:space-x-6">
      {isLoggedIn ? (
        <>
          <NewModelDropdown me={me} organizations={organizations} />
          {me.id && (
            <MenuLink
              href={`/users/${me.id}`}
              icon={<i className="ion-md-albums" />}
              text="My Models"
            />
          )}
          {hasOrganizations && (
            <OrganizationsDropdown organizations={organizations} />
          )}
          <ProfileDropdown me={props.me} />
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
          <MenuLink onClick={signUp} text="Sign Up" />
        </>
      )}
    </div>
  );
};
