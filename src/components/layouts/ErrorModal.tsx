import clsx from "clsx";
import React, { useCallback } from "react";
import Modal from "react-modal";

import Icon from "~/components/react-fa-patched";
import * as displayErrorActions from "~/modules/displayErrors/actions";
import { useAppDispatch, useAppSelector } from "~/modules/hooks";

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
  return (
    <Modal isOpen={isOpen} onRequestClose={closeModal} style={customStyles}>
      {isOpen && (
        <div
          className={clsx(
            "ui standard modal active visible transition",
            "!top-20" // overrides react-modal defaults
          )}
        >
          <div className="header">
            <Icon name="warning" /> Website Error!
          </div>
          <div className="content">
            <div className="description">
              <div className="ui header">Try refreshing the browser.</div>
              <p>
                An error report was sent to Ozzie. He'll work to fix it shortly.
              </p>
            </div>
          </div>
          <div className="actions">
            <div className="ui black deny button" onClick={closeModal}>
              Close
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
};
