import { withRouter } from "next/router";
import $ from "jquery";
import localLinks from "local-links";
import React, { Component } from "react";
import { connect } from "react-redux";

import * as modalActions from "gModules/modal/actions";

class NavHelper extends Component {
  onClick(event) {
    const pathname = localLinks.getLocalPathname(event);

    if (pathname) {
      event.preventDefault();
      this.props.router.push(pathname);
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

export default connect()(withRouter(NavHelper));
