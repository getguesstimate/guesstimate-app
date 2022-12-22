import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "next/router";

import { CardListElement } from "gComponents/utility/card/index";
import DropDown from "gComponents/utility/drop-down/index";

import * as meActions from "gModules/me/actions";
import * as modalActions from "gModules/modal/actions";
import * as navigationActions from "gModules/navigation/actions";
import * as spaceActions from "gModules/spaces/actions";

import { organization, user } from "gEngine/engine";

class Profile extends Component {
  signUp() {
    meActions.signUp();
  }

  signIn() {
    meActions.signIn();
  }

  logOut() {
    this.props.dispatch(meActions.logOut());
  }

  newModel(organizationId) {
    this.props.dispatch(
      spaceActions.create(organizationId, {}, this.props.router)
    );
  }

  _openModal() {
    this.props.dispatch(modalActions.openSettings());
  }

  profileDropdown() {
    const profile = this.props.me.profile;
    const portalUrl = _.get(profile, "account._links.payment_portal.href");

    let listElements = [
      {
        ionicIcon: "md-person",
        header: "account",
        onMouseDown: this._openModal.bind(this),
      },
      {
        icon: "rocket",
        header: "upgrade",
        onMouseDown: () => {
          this.props.router.push("/subscribe/lite");
        },
      },
      {
        ionicIcon: "ios-people",
        header: "New Organization",
        onMouseDown: () => {
          this.props.router.push("/organizations/new");
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
        onMouseDown: this.logOut.bind(this),
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
            <CardListElement
              {...props}
              key={props.header}
              closeOnClick={true}
            />
          ))}
        </DropDown>
      </div>
    );
  }

  closeDropdown(dropDown) {
    this.refs[dropDown] && this.refs[dropDown]._close();
  }

  newModelDropdown(me, organizations) {
    const ref = "newModel";
    const userPic = _.get(me, "profile.picture");
    const userName = _.get(me, "profile.name");
    const personalModel = {
      id: 0,
      header: userName,
      imageShape: "circle",
      onMouseDown: () => {
        this.newModel();
        this.closeDropdown(ref);
      },
    };
    userPic ? (personalModel.image = userPic) : (personalModel.icon = "user");
    let listElements = [{ props: personalModel }];
    if (organizations) {
      listElements = listElements.concat(
        organizations.map((o) => ({
          props: {
            header: `${o.name}`,
            imageShape: "circle",
            image: o.picture,
            onMouseDown: () => {
              this.newModel(o.id);
              this.closeDropdown(ref);
            },
          },
          id: o.id,
        }))
      );
    }

    return (
      <DropDown
        headerText={"Select Owner"}
        openLink={
          <a className="item new-model">
            {" "}
            <i className={`ion-md-add`} />{" "}
            <span className="text">New Model</span>{" "}
          </a>
        }
        ref={ref}
      >
        {listElements.map((element) => (
          <CardListElement {...element.props} key={element.id} />
        ))}
      </DropDown>
    );
  }

  organizationsDropdown(organizations) {
    const ref = "organizations";
    let listElements = [];

    if (organizations) {
      listElements = organizations.map((o) => ({
        props: {
          header: `${o.name}`,
          imageShape: "circle",
          image: organization.image(o),
          onMouseDown: () => {
            this.props.router.push(organization.url(o));
            this.closeDropdown(ref);
          },
        },
        id: o.id,
      }));
    }

    return (
      <DropDown
        headerText={"Organizations"}
        openLink={
          <a className="item">
            {" "}
            <i className={`ion-ios-people`} />{" "}
            <span className="text">Organizations</span>{" "}
          </a>
        }
        ref={ref}
      >
        {listElements.map((element) => (
          <CardListElement {...element.props} key={element.id} />
        ))}
      </DropDown>
    );
  }

  render() {
    const { me, isLoggedIn } = this.props;
    const organizations = user.usersOrganizations(
      this.props.me,
      this.props.userOrganizationMemberships,
      this.props.organizations
    );
    const hasOrganizations = organizations.length > 0;

    return (
      <div className="header-right-menu">
        {isLoggedIn &&
          hasOrganizations &&
          this.newModelDropdown(me, organizations)}
        {isLoggedIn && !hasOrganizations && (
          <a
            className="item new-model"
            onClick={this.newModel.bind(this, null)}
          >
            <i className={`ion-md-add`} />
            <span className="text">New Model</span>
          </a>
        )}

        {isLoggedIn && me.id && (
          <a className="item" href={`/users/${me.id}`}>
            <i className={`ion-md-albums`} />
            <span className="text">My Models</span>
          </a>
        )}

        {isLoggedIn &&
          hasOrganizations &&
          this.organizationsDropdown(organizations)}

        {isLoggedIn && this.profileDropdown()}

        {!isLoggedIn && (
          <a className={"item text scratchpad"} href="/scratchpad">
            Scratchpad
          </a>
        )}

        {!isLoggedIn && (
          <a className={"item text pricing"} href="/pricing">
            Plans
          </a>
        )}

        {!isLoggedIn && (
          <a
            className={"item text scratchpad"}
            href="http://docs.getguesstimate.com/"
          >
            Documentation
          </a>
        )}

        {!isLoggedIn && (
          <a className={"item text"} onClick={this.signIn.bind(this)}>
            Sign In
          </a>
        )}

        {!isLoggedIn && (
          <a className={"item text"} onClick={this.signUp.bind(this)}>
            Sign Up
          </a>
        )}
      </div>
    );
  }
}

export default connect()(withRouter(Profile));
