import clsx from "clsx";
import React, { useCallback } from "react";
import Modal from "react-modal";

import Icon from "~/components/react-fa-patched";
import * as displayErrorActions from "~/modules/displayErrors/actions";
import { useAppDispatch, useAppSelector } from "~/modules/hooks";
import { Button } from "../utility/buttons/button";
import { GeneralModal } from "../utility/GeneralModal";

export const ErrorModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const displayError = useAppSelector((state) => state.displayError);

  const closeModal = useCallback(() => {
    dispatch(displayErrorActions.close());
  }, [dispatch]);

  const customStyles = {
    overlay: {
      backgroundColor: "rgba(55, 68, 76, 0.4)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    content: {
      maxWidth: "50%",
      position: "initial",
      backgroundColor: "rgba(0,0,0,0)",
      border: "none",
      padding: "0",
    },
  } as const;

  const isOpen = displayError && displayError.length !== 0;
  if (!isOpen) {
    return null;
  }
  return (
    <GeneralModal onRequestClose={closeModal}>
      <div className="rounded">
        <div className="flex items-center gap-2 px-6 py-4">
          <Icon name="warning" className="text-xl" />
          <div className="text-xl font-bold">Website Error!</div>
        </div>
        <div className="border-t border-grey-1 p-6">
          <header className="mb-2 text-lg font-bold">
            Try refreshing the browser.
          </header>
          <p>
            An error report was sent to Ozzie. He'll work to fix it shortly.
          </p>
        </div>
        <div className="flex justify-end border-t border-grey-1 px-6 py-4">
          <Button size="padded" color="dark" onClick={closeModal}>
            Close
          </Button>
        </div>
      </div>
    </GeneralModal>
  );
};
