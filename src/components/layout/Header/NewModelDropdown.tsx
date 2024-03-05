import React, { FC, useRef } from "react";

import { useRouter } from "next/router";
import {
  CardListElement,
  CardListElementProps,
} from "~/components/utility/Card";
import { DropDown, DropDownHandle } from "~/components/utility/DropDown";
import { useAppDispatch } from "~/modules/hooks";
import { MeProfile } from "~/modules/me/slice";
import * as spaceActions from "~/modules/spaces/actions";

import { MenuLink } from "./MenuLink";

export const NewModelDropdown: FC<{
  profile: MeProfile;
  organizations: any;
}> = ({ profile, organizations }) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const ref = useRef<DropDownHandle | null>(null);
  const userPic = profile.picture;
  const userName = profile.name;

  const createModel = (organizationId: number | undefined) => {
    dispatch(spaceActions.create(organizationId, router));
  };

  const personalModel: CardListElementProps = {
    header: userName!,
    imageShape: "circle",
    onClick: () => {
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
          onClick: () => {
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
        onClick={() => createModel(undefined)}
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
