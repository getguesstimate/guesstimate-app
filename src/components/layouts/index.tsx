import React from "react";

import { ErrorModal } from "./ErrorModal";
import { NavHelper } from "~/components/utility/NavHelper/index";
import { ModalContainer } from "~/modules/modal/routes";
import { Main } from "./Main";
import { Footer } from "./Footer";
import { Header } from "./Header";

type Props = {
  isFluid?: boolean;
  simpleHeader?: boolean;
  showFooter?: boolean;
  embed?: boolean;
  fullHeight?: boolean;
  backgroundColor?: "BLUE" | "GREY";
  children: React.ReactNode;
};

export const Layout: React.FC<Props> = ({
  isFluid = false,
  simpleHeader = false,
  showFooter = true,
  embed = false,
  fullHeight = false,
  backgroundColor = undefined,
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
