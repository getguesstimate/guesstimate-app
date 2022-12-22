import _ from "lodash";
import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "next/router";

import { NewSpaceCard, SpaceCard } from "gComponents/spaces/cards";
import Container from "gComponents/utility/container/Container";

import { userSpaceSelector } from "./userSpaceSelector";

import * as spaceActions from "gModules/spaces/actions";
import * as userActions from "gModules/users/actions";

class UserShow extends Component {
  componentWillMount() {
    this.props.dispatch(userActions.fetchById(this.props.userId));
    this.props.dispatch(spaceActions.fetch({ userId: this.props.userId }));
  }

  _newModel() {
    this.props.dispatch(spaceActions.create(undefined, {}, this.props.router));
  }

  render() {
    const { userId, users } = this.props;
    const spaces = _.orderBy(
      this.props.userSpaces.asMutable(),
      ["updated_at"],
      ["desc"]
    );
    const isMe = parseInt(this.props.me.id) === parseInt(userId);

    let user = null;

    if (users && users.length) {
      user = users.find((u) => u.id.toString() === userId.toString());
    }

    return (
      <Container>
        <div className="UserShow">
          <div className="row">
            <div className="col-md-4" />
            <div className="col-md-4 col-xs-12">
              {user && (
                <div className="main-user-tag">
                  <img src={user.picture} />
                  {user && <h1>{user.name}</h1>}
                </div>
              )}
            </div>
          </div>
          {spaces && (
            <div className="row">
              {isMe && <NewSpaceCard onClick={this._newModel.bind(this)} />}
              {_.map(spaces, (s) => (
                <SpaceCard key={s.id} space={s} showPrivacy={isMe} />
              ))}
            </div>
          )}
        </div>
      </Container>
    );
  }
}

export default connect(_.partialRight(_.pick, ["me", "users"]))(
  connect(userSpaceSelector)(withRouter(UserShow))
);
