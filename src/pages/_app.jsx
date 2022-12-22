import Head from "next/head";
import Script from "next/script";
import { useState, useEffect } from "react";

import { Provider } from "react-redux";
import configureStore from "../modules/store";

import "flexboxgrid/css/flexboxgrid.min.css";
import "font-awesome/css/font-awesome.css";
import "ionicons/dist/css/ionicons.css";
import "react-dd-menu/dist/react-dd-menu.css";
import "../../semantic/dist/semantic.css";
//semantic js is dependent on jquery, which has trouble now
import "../styles/FlowGrid.css";
import "../styles/legacyStyles.css";
import "../styles/theme.css";

import * as meActions from "gModules/me/actions";
import "../routes/app";

// hacky, consider https://github.com/kirill-konshin/next-redux-wrapper
let store = undefined;

const MyApp = ({ Component }) => {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);
  if (!store) {
    store = configureStore();
  }

  useEffect(() => {
    // this must be at the top level because we don't want it to fire too often
    store.dispatch(meActions.init());
  }, [store.dispatch]);

  const baseDescription =
    "Plan finances, make strategic decisions, and do risk assessment.  Guesstimate uses stochastic models, Monte Carlo simulations, and sensitivity analyses.";

  // titleTemplate="%s | Guesstimate"

  return (
    <>
      <Script id="elev">{`var _elev = window._elev || {};(function() {
      var i,e;i=document.createElement("script"),i.type='text/javascript';i.async=1,i.src="https://static.elev.io/js/v3.js",e=document.getElementsByTagName("script")[0],e.parentNode.insertBefore(i,e);})();
      _elev.account_id = '565e550e67ffc'`}</Script>
      <Script id="wistia" src="//fast.wistia.com/assets/external/E-v1.js" />
      <Script id="twitter">{`!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0],p=/^http:/.test(d.location)?'http':'https';if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src=p+"://platform.twitter.com/widgets.js";fjs.parentNode.insertBefore(js,fjs);}}(document,"script","twitter-wjs");`}</Script>
      <Script id="chargebee" src="https://js.chargebee.com/v1/chargebee.js" />
      <Head>
        <title key="title">Guesstimate</title>
        <link rel="icon" type="image/png" href="/favicon.png" />`
        <link
          href="https://fonts.googleapis.com/css?family=Lato:400,700,300"
          rel="stylesheet"
          type="text/css"
        />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, user-scalable=no"
        />
        <meta name="fragment" content="!" />
        <meta name="description" key="description" content={baseDescription} />
        <meta property="og:type" key="og:type" content="product" />
        <meta
          property="og:title"
          key="og:title"
          content="Guesstimate | A Spreadsheet for the Uncertain"
        />
        <meta
          property="og:description"
          key="og:description"
          content={baseDescription}
        />
      </Head>
      <Provider store={store}>{isClient ? <Component /> : null}</Provider>
    </>
  );
};

// https://stackoverflow.com/a/64509306
export default MyApp;
