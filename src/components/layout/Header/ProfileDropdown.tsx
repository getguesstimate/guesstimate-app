import React, { FC } from "react";

import _ from "lodash";
import { signOut } from "next-auth/react";
import { useRouter } from "next/router";
import {
  CardListElement,
  CardListElementProps,
} from "~/components/utility/Card";
import { DropDown } from "~/components/utility/DropDown";
import { useAppDispatch } from "~/modules/hooks";
import { MeProfile } from "~/modules/me/slice";
import * as modalActions from "~/modules/modal/actions";
import * as navigationActions from "~/modules/navigation/actions";

export const ProfileDropdown: FC<{
  profile: MeProfile;
}> = ({ profile }) => {
  const portalUrl = _.get(profile, "account._links.payment_portal.href");
  const router = useRouter();
  const dispatch = useAppDispatch();

  const openModal = () => {
    dispatch(modalActions.openSettings());
  };

  let listElements: CardListElementProps[] = [
    {
      ionicIcon: "md-person",
      header: "account",
      onClick: openModal,
    },
    {
      icon: "rocket",
      header: "upgrade",
      onClick: () => {
        router.push("/subscribe/lite");
      },
    },
    {
      ionicIcon: "ios-people",
      header: "New Organization",
      onClick: () => {
        router.push("/organizations/new");
      },
    },
    {
      ionicIcon: "md-help",
      header: "Documentation",
      onClick: () => {
        navigationActions.externalNavigate("http://docs.getguesstimate.com/");
      },
    },
    {
      ionicIcon: "ios-chatbubbles",
      header: "Discord",
      onClick: () => {
        navigationActions.externalNavigate("https://discord.gg/nsTnQTgtG6");
      },
    },
    {
      ionicIcon: "ios-send",
      header: "Email Us",
      onClick: () => {
        navigationActions.externalNavigate(
          "mailto:support@quantifieduncertainty.org"
        );
      },
    },
    {
      ionicIcon: "md-log-out",
      header: "Sign Out",
      onClick: () => signOut(),
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
        <CardListElement {...props} key={props.header} closeOnClick />
      ))}
    </DropDown>
  );
};
