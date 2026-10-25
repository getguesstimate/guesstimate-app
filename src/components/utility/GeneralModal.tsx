import React from "react";
import Modal from "react-modal";

const customStyles = {
  overlay: {
    backgroundColor: "var(--overlay)",
  },
  content: {
    position: "absolute",
    top: "6%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    border: "none",
    overflow: "visible",
    padding: "0px",
    transform: "translateX(-50%)",
    marginRight: "-50%",
    marginBottom: "2em",
    backround: "transparent",
  },
} as const;

export const GeneralModal: React.FC<{
  onRequestClose(): void;
  children: React.ReactNode;
}> = ({ onRequestClose, children }) => (
  <Modal isOpen={true} onRequestClose={onRequestClose} style={customStyles}>
    {children}
  </Modal>
);
