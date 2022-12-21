import app from "ampersand-app";
import $ from "jquery";
import localLinks from "local-links";
import React, { Component } from "react";
import { connect } from "react-redux";

import * as modalActions from "gModules/modal/actions.js";

@connect()
export default class NavHelper extends Component {
  onClick(event) {
    const pathname = localLinks.getLocalPathname(event);

    if (pathname) {
      event.preventDefault();
      app.router.history.navigate(pathname);
      this.props.dispatch(modalActions.close());
    }
  }

  componentDidMount() {
    $(document).on("keydown", (e) => {
      if (e.which === 8 && $(e.target).is("body")) {
        e.preventDefault();
      }
    });
  }

  render() {
    return (
      <div className="navHelper" onClick={this.onClick.bind(this)}>
        {this.props.children}
      </div>
    );
  }
}
