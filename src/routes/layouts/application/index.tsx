import React from "react";

import ErrorModal from "gComponents/application/errorModal/index";
import Main from "gComponents/layouts/main/index";
import NavHelper from "gComponents/utility/NavHelper/index";
import ModalContainer from "gModules/modal/routes";
import Footer from "../footer";
import Header from "../header";

type Props = {
  isFluid?: boolean;
  simpleHeader?: boolean;
  showFooter?: boolean;
  embed?: boolean;
  fullHeight?: boolean;
  backgroundColor?: "BLUE" | "GREY";
  children: React.ReactElement;
};

const Layout: React.FC<Props> = ({
  isFluid = false,
  simpleHeader = false,
  showFooter = true,
  embed = false,
  fullHeight = false,
  backgroundColor = "",
  children,
}) => {
  return (
    <NavHelper>
      <ErrorModal />
      <div className={`Layout ${fullHeight ? "fullHeight" : ""}`}>
        <ModalContainer />
        {!embed && <Header isFluid={isFluid} isBare={simpleHeader} />}
        <Main isFluid={isFluid} backgroundColor={backgroundColor}>
          {children}
        </Main>
        {showFooter && <Footer />}
      </div>
    </NavHelper>
  );
};

export default Layout;
