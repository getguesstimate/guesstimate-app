import React, { Component } from "react";
import { connect } from "react-redux";

import NavHelper from "gComponents/utility/NavHelper/index";
import ErrorModal from "gComponents/application/errorModal/index";
import Main from "gComponents/layouts/main/index";
import ModalContainer from "gModules/modal/routes";
import Footer from "../footer";
import Header from "../header";

import * as meActions from "gModules/me/actions";

function mapStateToProps(state) {
  return {
    spaces: state.spaces,
    me: state.me,
  };
}

class Layout extends Component {
  componentWillMount() {
    this.props.dispatch(meActions.init());
  }

  render() {
    const options = Object.assign(
      {},
      {
        isFluid: false,
        simpleHeader: false,
        showFooter: true,
        embed: false,
        fullHeight: false,
      },
      this.props.options
    );

    const body = this.props.page || this.props.children;

    return (
      <NavHelper>
        <ErrorModal />
        <div className={`Layout ${options.fullHeight ? "fullHeight" : ""}`}>
          <ModalContainer />
          {!options.embed && (
            <Header isFluid={options.isFluid} isBare={options.simpleHeader} />
          )}
          <Main
            isFluid={options.isFluid}
            backgroundColor={options.backgroundColor}
          >
            {body}
          </Main>
          {options.showFooter && <Footer />}
        </div>
      </NavHelper>
    );
  }
}

export default connect(mapStateToProps)(Layout);
