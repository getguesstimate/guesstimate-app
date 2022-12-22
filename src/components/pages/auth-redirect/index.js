import { withRouter } from "next/router";

import { user } from "gEngine/engine";
import * as meActions from "gModules/me/actions";
import React, { Component } from "react";
import { connect } from "react-redux";
import PageBase from "../base/index";

const content = `
# Redirection 

## You are being redirected.
`;

function mapStateToProps(state) {
  return {
    me: state.me,
  };
}

class AuthRedirect extends Component {
  componentWillMount() {
    this.props.dispatch(meActions.logIn());
  }

  componentDidUpdate() {
    if (this.props.me && this.props.me.id) {
      this.props.router.push(user.urlById(this.props.me.id));
    }
  }

  render() {
    return (
      <div>
        <PageBase content={content} />
      </div>
    );
  }
}

export default connect(mapStateToProps)(withRouter(AuthRedirect));
