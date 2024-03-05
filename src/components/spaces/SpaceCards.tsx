import React from "react";

import clsx from "clsx";
import _ from "lodash";
import Icon from "~/components/react-fa-patched";
import { formatDate, formatDescription } from "~/components/spaces/shared";
import * as Organization from "~/lib/engine/organization";
import * as Space from "~/lib/engine/space";
import * as User from "~/lib/engine/user";

import { UserTag } from "../UserTag";

const arrowsVisibleImage = "/assets/metric-icons/blue/arrows-visible.png";

type Size = "SMALL"; // default is undefined

const BlankScreenshot: React.FC<{ size?: Size }> = ({ size }) => (
  <div className="grid h-full place-items-center">
    <img
      className={clsx(
        "w-auto opacity-[0.25]",
        size === "SMALL" ? "max-h-8" : "mb-4 max-h-32"
      )}
      src={arrowsVisibleImage}
    />
  </div>
);

const SingleButton: React.FC<{ isPrivate: boolean }> = ({ isPrivate }) => (
  <div className="pl-0.5 text-[1.6em] text-[#6e7980]">
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
        "flex h-full flex-col",
        "cursor-pointer rounded-sm border border-transparent",
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
    <div className="flex h-full flex-col items-center justify-center rounded-sm bg-[#cee4ce]">
      <Icon name="plus" className="text-[4.5em] text-[#79b979]" />
      <header className="mt-4 text-3xl font-bold text-[#32403c]">
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
              size === "SMALL" ? "text-xs" : "text-lg leading-tight",
              space.name ? "text-[#4a6a88]" : "italic text-grey-bbb"
            )}
          >
            {space.name || "Untitled Model"}
          </header>
          {size !== "SMALL" && (
            <div className="mt-0.5 text-xs text-grey-888">
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
          <BlankScreenshot size={size} />
          {space.big_screenshot && <img src={space.big_screenshot} />}
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
        <a href={spaceUrl} className="flex-1 rounded-b-sm bg-white p-2">
          <p className="break-words text-sm text-[#78838c]">
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
    <div className="grid place-items-stretch gap-12 px-4 lg:grid-cols-3">
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
