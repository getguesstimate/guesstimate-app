import { FC, PropsWithChildren } from "react";

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

export const AppLayout: FC<Props> = ({
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
        {process.env.NEXT_PUBLIC_PLANNED_MAINTENANCE && (
          <div className="bg-purple-2 p-2 text-sm text-white">
            <div className="container mx-auto">
              Guesstimate will be down for maintenance in the next few hours.
              <br />
              Loading models should work for most of that period, but editing
              will be unavailable for a short time.
            </div>
          </div>
        )}
        <Main isFluid={isFluid} backgroundColor={backgroundColor}>
          {children}
        </Main>
        {showFooter && <Footer />}
      </div>
    </NavHelper>
  );
};
