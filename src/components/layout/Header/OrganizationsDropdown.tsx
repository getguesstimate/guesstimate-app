import React, { FC, useRef } from "react";

import { useRouter } from "next/router";
import {
  CardListElement,
  CardListElementProps,
} from "~/components/utility/Card";
import { DropDown, DropDownHandle } from "~/components/utility/DropDown";
import { organization } from "~/lib/engine/engine";

import { MenuLink } from "./MenuLink";

export const OrganizationsDropdown: FC<{
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
        onClick: () => {
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
