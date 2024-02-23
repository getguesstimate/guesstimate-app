import React, { FC, PropsWithChildren } from "react";

import clsx from "clsx";
import { NavHelper } from "~/components/utility/NavHelper/index";
import { ModalContainer } from "~/modules/modal/routes";

import { ErrorModal } from "./ErrorModal";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { Main } from "./Main";

type Props = PropsWithChildren<{
  isFluid?: boolean;
  simpleHeader?: boolean;
  showFooter?: boolean;
  embed?: boolean;
  fullHeight?: boolean;
  backgroundColor?: "GREY";
}>;

export const Layout: FC<Props> = ({
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
        className={clsx("flex min-h-screen flex-col", fullHeight && "h-full")}
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
