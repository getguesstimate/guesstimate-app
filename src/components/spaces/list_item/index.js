import React, { Component } from "react";
import { connect } from "react-redux";

import Icon from "gComponents/react-fa-patched";

import { formatDate, formatDescription } from "gComponents/spaces/shared";
import { denormalizedSpaceSelector } from "../denormalized-space-selector";

import * as e from "gEngine/engine";
import * as Space from "gEngine/space";

import arrowsVisibleImage from "../../../assets/metric-icons/blue/arrows-visible.png";

let PrivateTag = ({ isPrivate }) => (
  <div className="col-xs-12">
    <div className="privacy-tag">
      <Icon name={isPrivate ? "lock" : "globe"} />
      {isPrivate ? "Private" : "Public"}
    </div>
  </div>
);

let BlankScreenshot = ({ isPrivate }) => (
  <div className="snapshot blank">
    {!isPrivate && <img src={arrowsVisibleImage} />}
    {isPrivate && <Icon name="lock" />}
  </div>
);

const SpaceListItem = ({ space, showUser, isOwnedByMe, showScreenshot }) => {
  const hasName = !_.isEmpty(space.name);
  const className = `text-editable ${hasName ? "" : "default-value"}`;
  const showName = hasName ? space.name : "Untitled Model";
  return (
    <div className="SpaceListItem">
      <a href={Space.url(space)}>
        <div className="row">
          {showScreenshot && (
            <div className="col-sm-3">
              {space.screenshot && (
                <div className="snapshot">
                  {" "}
                  <img src={space.screenshot} />{" "}
                </div>
              )}
              {!space.screenshot && (
                <BlankScreenshot isPrivate={space.is_private} />
              )}
            </div>
          )}
          <div className={`col-sm-${showScreenshot ? 9 : 12}`}>
            <div className="row">
              <div className="col-xs-9">
                <h3 className={className}> {showName} </h3>
                <p>Updated {formatDate(space.updated_at)}</p>
              </div>
              <div className="col-xs-3">
                <div className="row">
                  {space.user && showUser && (
                    <div className="col-xs-12">
                      <div className="user-tag">
                        <img
                          className="ui avatar image"
                          src={space.user.picture}
                        />
                        {space.user.name}
                      </div>
                    </div>
                  )}

                  {isOwnedByMe && <PrivateTag isPrivate={space.is_private} />}
                </div>
              </div>
            </div>

            {!_.isEmpty(space.description) && (
              <div className="row description">
                <div className="col-xs-12">
                  <p> {formatDescription(space.description)} </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </a>
    </div>
  );
};

export default
@connect(_.partialRight(_.pick, ["spaces", "me"]))
@connect(denormalizedSpaceSelector)
class SpaceListItemComponent extends Component {
  render() {
    const isOwnedByMe = e.me.isOwnedByMe(
      this.props.me,
      this.props.denormalizedSpace
    );
    if (!!this.props.denormalizedSpace) {
      return (
        <SpaceListItem
          space={this.props.denormalizedSpace}
          showUser={this.props.showUser}
          isOwnedByMe={isOwnedByMe}
          showScreenshot={this.props.showScreenshot}
        />
      );
    } else {
      return false;
    }
  }
}
