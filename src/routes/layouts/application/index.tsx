import React, { useEffect } from "react";

import NavHelper from "gComponents/utility/NavHelper/index";
import ErrorModal from "gComponents/application/errorModal/index";
import Main from "gComponents/layouts/main/index";
import ModalContainer from "gModules/modal/routes";
import Footer from "../footer";
import Header from "../header";

import * as meActions from "gModules/me/actions";
import { useAppDispatch } from "gModules/hooks";

type Props = {
  options: Partial<{
    isFluid: boolean;
    simpleHeader: boolean;
    showFooter: boolean;
    embed: boolean;
    fullHeight: boolean;
    backgroundColor: "BLUE" | "GREY";
  }>;
  children: React.ReactElement;
};

const Layout: React.FC<Props> = ({
  options: {
    isFluid = false,
    simpleHeader = true,
    showFooter = true,
    embed = false,
    fullHeight = false,
    backgroundColor = "",
  },
  children,
}) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(meActions.init());
  }, [dispatch]);

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
