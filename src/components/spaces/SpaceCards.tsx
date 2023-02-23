import _ from "lodash";
import React from "react";

import Icon from "~/components/react-fa-patched";

import * as Organization from "~/lib/engine/organization";
import * as Space from "~/lib/engine/space";
import * as User from "~/lib/engine/user";

import clsx from "clsx";
import { formatDate, formatDescription } from "~/components/spaces/shared";
import { UserTag } from "../UserTag";

const arrowsVisibleImage = "/assets/metric-icons/blue/arrows-visible.png";

type Size = "SMALL"; // default is undefined

const BlankScreenshot: React.FC<{ size?: Size }> = ({ size }) => (
  <div className="grid place-items-center h-full">
    <img
      className={clsx(
        "opacity-[0.25] w-auto",
        size === "SMALL" ? "max-h-8" : "max-h-32 mb-4"
      )}
      src={arrowsVisibleImage}
    />
  </div>
);

const SingleButton: React.FC<{ isPrivate: boolean }> = ({ isPrivate }) => (
  <div className="text-[1.6em] text-[#6e7980] pl-0.5">
    <Icon name={isPrivate ? "lock" : "globe"} />
  </div>
);

const ButtonArea: React.FC<{
  owner: any;
  ownerUrl: string;
  isPrivate: boolean;
  showPrivacy?: boolean;
}> = ({ owner, ownerUrl, isPrivate, showPrivacy }) => (
  <div>
    {owner && (
      <UserTag url={ownerUrl} picture={owner.picture} name={owner.name} />
    )}
    {showPrivacy && <SingleButton isPrivate={isPrivate} />}
  </div>
);

const SpaceCardBox: React.FC<{
  children: React.ReactNode;
  onClick?(): void;
  isNew?: boolean;
}> = ({ children, onClick, isNew }) => {
  return (
    <div
      className={clsx(
        "h-full flex flex-col",
        "border border-transparent cursor-pointer rounded-sm",
        isNew ? "hover:border-[#61a761]" : "hover:border-[#c2cdd6]",
        isNew && "min-h-[12em]"
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export const NewSpaceCard: React.FC<{ onClick(): void }> = ({ onClick }) => (
  <SpaceCardBox onClick={onClick} isNew>
    <div className="bg-[#cee4ce] h-full flex flex-col justify-center items-center rounded-sm">
      <Icon name="plus" className="text-[4.5em] text-[#79b979]" />
      <header className="text-3xl text-[#32403c] font-bold mt-4">
        New Model
      </header>
    </div>
  </SpaceCardBox>
);

export const SpaceCard: React.FC<{
  space: any;
  showPrivacy?: boolean;
  size?: Size;
  urlParams?: any;
}> = ({ space, showPrivacy, size = undefined, urlParams = {} }) => {
  const hasOrg = _.has(space, "organization.name");

  const owner = hasOrg ? space.organization : space.user;
  const ownerUrl = hasOrg
    ? Organization.url(space.organization)
    : User.url(space.user);

  const spaceUrl = Space.spaceUrlById(space.id, urlParams);

  return (
    <SpaceCardBox>
      <a href={spaceUrl}>
        <header
          className={clsx(
            "rounded-t-sm bg-white",
            size === "SMALL" ? "p-1" : "p-2"
          )}
        >
          <header
            className={clsx(
              "font-bold",
              size === "SMALL" ? "text-xs" : "text-lg",
              space.name ? "text-[#4a6a88]" : "text-grey-bbb italic"
            )}
          >
            {space.name || "Untitled Model"}
          </header>
          {size !== "SMALL" && (
            <div className="text-xs text-grey-888">
              Updated {formatDate(space.updated_at)}
            </div>
          )}
        </header>
      </a>

      <div
        className={clsx(
          "relative bg-[#d9dee2]",
          size === "SMALL" ? "min-h-[32px]" : "min-h-[11em]",
          size === "SMALL" && "rounded-b-sm"
        )}
      >
        <a href={spaceUrl}>
          {space.big_screenshot ? (
            <img src={space.big_screenshot} />
          ) : (
            <BlankScreenshot size={size} />
          )}
        </a>
        <div className="absolute bottom-2 left-2 z-10">
          <ButtonArea
            owner={owner}
            ownerUrl={ownerUrl}
            isPrivate={space.is_private}
            showPrivacy={showPrivacy}
          />
        </div>
      </div>
      {size !== "SMALL" && (
        <a href={spaceUrl} className="p-2 rounded-b-sm bg-white flex-1">
          <p className="text-sm text-[#78838c] break-words">
            {formatDescription(space.description)}
          </p>
        </a>
      )}
    </SpaceCardBox>
  );
};

export const SpaceCardGrid: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <div className="grid lg:grid-cols-3 place-items-stretch gap-12 px-4">
      {children}
    </div>
  );
};

export const SpaceCards: React.FC<{
  spaces: any[];
  showPrivacy: boolean;
}> = ({ spaces, showPrivacy }) => (
  <SpaceCardGrid>
    {spaces.map((s) => (
      <SpaceCard key={s.id} space={s} showPrivacy={showPrivacy} />
    ))}
  </SpaceCardGrid>
);
