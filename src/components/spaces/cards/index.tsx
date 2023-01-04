import _ from "lodash";
import React from "react";
import { useRouter } from "next/router";

import Icon from "~/components/react-fa-patched";

import * as Organization from "~/lib/engine/organization";
import * as Space from "~/lib/engine/space";
import * as User from "~/lib/engine/user";

import { formatDate, formatDescription } from "~/components/spaces/shared";

const arrowsVisibleImage = "/assets/metric-icons/blue/arrows-visible.png";

const BlankScreenshot: React.FC = () => (
  <div className="snapshot blank">
    <img src={arrowsVisibleImage} />
  </div>
);

const SingleButton: React.FC<{ isPrivate: boolean }> = ({ isPrivate }) => (
  <div className="tag">
    <Icon name={isPrivate ? "lock" : "globe"} />
  </div>
);

const ButtonArea: React.FC<any> = ({
  owner,
  ownerUrl,
  isPrivate,
  showPrivacy,
}) => (
  <div className="hover-row">
    {owner && (
      <a href={ownerUrl} className="owner-tag">
        {!!owner.picture && <img className="avatar" src={owner.picture} />}
        <div className="name">{owner.name}</div>
      </a>
    )}
    {showPrivacy && <SingleButton isPrivate={isPrivate} />}
  </div>
);

export const NewSpaceCard: React.FC<any> = ({ onClick }) => (
  <div className="col-xs-12 col-md-4 SpaceCard new" onClick={onClick}>
    <div className="SpaceCard--inner">
      <div className="section-middle">
        <Icon name="plus" />
        <h3>New Model</h3>
      </div>
    </div>
  </div>
);

export const SpaceCard: React.FC<{
  space: any;
  showPrivacy?: boolean;
  size?: string;
  urlParams?: any;
}> = ({ space, showPrivacy, size = undefined, urlParams = {} }) => {
  const router = useRouter();
  const hasName = !_.isEmpty(space.name);
  const hasOrg = _.has(space, "organization.name");

  const owner = hasOrg ? space.organization : space.user;
  const ownerUrl = hasOrg
    ? Organization.url(space.organization)
    : User.url(space.user);

  const spaceUrl = Space.spaceUrlById(space.id, urlParams);
  const navigateToSpace = () => router.push(spaceUrl);

  return (
    <div
      className={`SpaceCard ${
        size === "SMALL" ? "SMALL" : "col-xs-12 col-md-4"
      }`}
    >
      <div className="SpaceCard--inner" onClick={navigateToSpace}>
        <div className={`header ${hasName ? "" : "default-name"}`}>
          <a href={spaceUrl}>
            <h3>{hasName ? space.name : "Untitled Model"}</h3>
          </a>
          {size !== "SMALL" && (
            <div className="changed-at">
              Updated {formatDate(space.updated_at)}
            </div>
          )}
        </div>

        <div className="image">
          <BlankScreenshot />
          <a href={spaceUrl}>
            <img src={space.big_screenshot} />
          </a>
          <ButtonArea
            owner={owner}
            ownerUrl={ownerUrl}
            isPrivate={space.is_private}
            showPrivacy={showPrivacy}
          />
        </div>
        {size !== "SMALL" && (
          <div className="body">
            <p> {formatDescription(space.description)} </p>
          </div>
        )}
      </div>
    </div>
  );
};

const SpaceCards: React.FC<{
  spaces: any[];
  showPrivacy: boolean;
}> = ({ spaces, showPrivacy }) => (
  <div className="row">
    {_.map(spaces, (s) => (
      <SpaceCard key={s.id} space={s} showPrivacy={showPrivacy} />
    ))}
  </div>
);

export default SpaceCards;
