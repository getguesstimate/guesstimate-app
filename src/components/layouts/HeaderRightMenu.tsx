import _ from "lodash";
import { useRouter } from "next/router";
import React, { useRef } from "react";

import {
  CardListElement,
  CardListElementProps,
} from "~/components/utility/card/index";
import DropDown from "~/components/utility/drop-down/index";

import * as meActions from "~/modules/me/actions";
import * as modalActions from "~/modules/modal/actions";
import * as navigationActions from "~/modules/navigation/actions";
import * as spaceActions from "~/modules/spaces/actions";

import { organization, user } from "~/lib/engine/engine";
import { useAppDispatch } from "~/modules/hooks";
import { RootState } from "~/modules/store";

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
    <div className="item">
      <DropDown
        headerText={profile.name}
        openLink={<img className="avatar" src={profile.picture} />}
      >
        {listElements.map((props) => (
          <CardListElement {...props} key={props.header} closeOnClick={true} />
        ))}
      </DropDown>
    </div>
  );
};

const NewModelDropdown: React.FC<{
  me: RootState["me"];
  organizations: any;
}> = ({ me, organizations }) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const ref = useRef<DropDown | null>(null);
  const userPic = _.get(me, "profile.picture");
  const userName = _.get(me, "profile.name");

  const createModel = (organizationId: number | undefined) => {
    dispatch(spaceActions.create(organizationId, router));
  };

  const personalModel: CardListElementProps = {
    header: userName!,
    imageShape: "circle" as const,
    onMouseDown: () => {
      createModel(undefined);
      ref.current?._close();
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
          header: `${o.name}`,
          imageShape: "circle" as const,
          image: o.picture,
          onMouseDown: () => {
            createModel(o.id);
            ref.current?._close();
          },
        },
        id: o.id,
      }))
    );
  }

  if (!organizations?.length) {
    return (
      <a
        className="item new-model"
        onClick={() => {
          createModel(undefined);
        }}
      >
        <i className="ion-md-add" />
        <span className="text">New Model</span>
      </a>
    );
  }

  return (
    <DropDown
      headerText="Select Owner"
      openLink={
        <a className="item new-model">
          <i className="ion-md-add" />
          <span className="text">New Model</span>
        </a>
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

  const ref = useRef<DropDown | null>(null);

  let listElements: { props: CardListElementProps; id: string }[] = [];

  if (organizations) {
    listElements = organizations.map((o) => ({
      props: {
        header: String(o.name),
        imageShape: "circle",
        image: organization.image(o),
        onMouseDown: () => {
          router.push(organization.url(o));
          ref.current?._close();
        },
      },
      id: o.id,
    }));
  }

  return (
    <DropDown
      headerText="Organizations"
      openLink={
        <a className="item">
          <i className="ion-ios-people" />
          <span className="text">Organizations</span>
        </a>
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
    <div className="header-right-menu">
      {isLoggedIn ? (
        <>
          <NewModelDropdown me={me} organizations={organizations} />
          {me.id && (
            <a className="item" href={`/users/${me.id}`}>
              <i className="ion-md-albums" />
              <span className="text">My Models</span>
            </a>
          )}
          {hasOrganizations && (
            <OrganizationsDropdown organizations={organizations} />
          )}
          <ProfileDropdown me={props.me} />
        </>
      ) : (
        <>
          <a className="item text scratchpad" href="/scratchpad">
            Scratchpad
          </a>
          <a className="item text pricing" href="/pricing">
            Plans
          </a>
          <a
            className="item text scratchpad"
            href="http://docs.getguesstimate.com/"
          >
            Documentation
          </a>
          <a className="item text" onClick={signIn}>
            Sign In
          </a>
          <a className="item text" onClick={signUp}>
            Sign Up
          </a>
        </>
      )}
    </div>
  );
};
