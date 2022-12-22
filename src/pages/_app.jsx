import dynamic from "next/dynamic";
import Head from "next/head";

import { Provider } from "react-redux";
import configureStore from "../modules/store";

import "../routes/layouts/application/style.css";
import "flexboxgrid/css/flexboxgrid.min.css";
import "react-dd-menu/dist/react-dd-menu.css";
import "ionicons/dist/css/ionicons.css";
import "../../semantic/dist/semantic.css";
import "font-awesome/css/font-awesome.css";
//semantic js is dependent on jquery, which has trouble now
import "../styles/theme.css";
import "../styles/legacyStyles.css";
import "../styles/FlowGrid.css";

import "../routes/app";

// hacky, consider https://github.com/kirill-konshin/next-redux-wrapper
let store = undefined;

const MyApp = ({ Component }) => {
  if (!store) {
    store = configureStore();
  }

  const baseDescription =
    "Plan finances, make strategic decisions, and do risk assessment.  Guesstimate uses stochastic models, Monte Carlo simulations, and sensitivity analyses.";

  // titleTemplate="%s | Guesstimate"

  return (
    <>
      <Head>
        <title key="title">Guesstimate</title>
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
      <Provider store={store}>
        <Component />
      </Provider>
    </>
  );
};

// https://stackoverflow.com/a/64509306
export default dynamic(() => Promise.resolve(MyApp), {
  ssr: false,
});
