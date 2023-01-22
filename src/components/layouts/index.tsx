import React from "react";

import { ErrorModal } from "./ErrorModal";
import { NavHelper } from "~/components/utility/NavHelper/index";
import { ModalContainer } from "~/modules/modal/routes";
import { Main } from "./Main";
import { Footer } from "./Footer";
import { Header } from "./Header";
import clsx from "clsx";

type Props = {
  isFluid?: boolean;
  simpleHeader?: boolean;
  showFooter?: boolean;
  embed?: boolean;
  fullHeight?: boolean;
  backgroundColor?: "GREY";
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
      <div
        className={clsx(
          "Layout",
          "flex flex-col min-h-screen",
          fullHeight && "h-full"
        )}
      >
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
