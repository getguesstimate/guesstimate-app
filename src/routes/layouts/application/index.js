import React, { Component } from "react";
import { connect } from "react-redux";

import Helmet from "react-helmet";

import ErrorModal from "gComponents/application/errorModal/index";
import Main from "gComponents/layouts/main/index";
import NavHelper from "gComponents/utility/NavHelper/index";
import ModalContainer from "gModules/modal/routes";
import Footer from "../footer";
import Header from "../header";

import * as meActions from "gModules/me/actions";

import "../../../../node_modules/flexboxgrid/css/flexboxgrid.min.css";
import "../../../../node_modules/ionicons/dist/css/ionicons.css";
import "../../../../node_modules/react-dd-menu/dist/react-dd-menu.css";
import "../../../../semantic/dist/semantic.css";
import "./style.css";
//semantic js is dependent on jquery, which has trouble now
import "../../../styles/theme.css";

function mapStateToProps(state) {
  return {
    spaces: state.spaces,
    me: state.me,
  };
}

@connect(mapStateToProps)
export default class Layout extends Component {
  componentWillMount() {
    this.props.dispatch(meActions.init());
  }

  _registerUser() {
    if (_.has(this.props, "me.id")) {
      const { id, profile } = this.props.me;
    }
  }

  render() {
    let options = Object.assign(
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

    this._registerUser();
    let body = this.props.page;

    const baseDescription =
      "Plan finances, make strategic decisions, and do risk assessment.  Guesstimate uses stochastic models, Monte Carlo simulations, and sensitivity analyses.";

    return (
      <NavHelper>
        <Helmet
          defaultTitle="Guesstimate"
          titleTemplate="%s | Guesstimate"
          meta={[
            { name: "Description", content: baseDescription },
            { property: "og:type", content: "product" },
            {
              property: "og:title",
              content: "Guesstimate | A Spreadsheet for the Uncertain",
            },
            { property: "og:description", content: baseDescription },
          ]}
        />
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
            {" "}
            {body}{" "}
          </Main>
          {options.showFooter && <Footer />}
        </div>
      </NavHelper>
    );
  }
}
