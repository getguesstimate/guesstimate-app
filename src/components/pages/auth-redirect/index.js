import app from "ampersand-app";
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

@connect(mapStateToProps)
export default class AuthRedirect extends Component {
  componentWillMount() {
    this.props.dispatch(meActions.logIn());
  }

  componentDidUpdate() {
    if (this.props.me && this.props.me.id) {
      app.router.history.navigate(user.urlById(this.props.me.id));
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
