import { FC } from "react";

import Modal from "react-modal";
import { FirstSubscriptionContainer } from "~/components/subscriptions/FirstSubscription/container";
import { SettingsContainer } from "~/components/users/settings/SettingsContainer";
import { AccountSettingsDialog } from "~/components/account/AccountSettings";
import styles from "../../components/account/account.module.css";
import { NavHelper } from "~/components/utility/NavHelper/index";
import { useAppDispatch, useAppSelector } from "~/modules/hooks";
import * as modalActions from "~/modules/modal/actions";

import { ModalState } from "./reducer";

const Confirmation: FC<{
  message: string;
  onConfirm(): void;
  onClose(): void;
}> = ({ message, onConfirm, onClose }) => {
  return (
    <div>
      <h2 className={styles.confirmTitle}>Confirm action</h2>
      <p className={styles.confirmMessage}>{message}</p>
      <div className={styles.actions}>
        <button type="button" className={styles.secondary} onClick={onClose}>
          Cancel
        </button>
        <button type="button" className={styles.primary} onClick={onConfirm}>
          Confirm
        </button>
      </div>
    </div>
  );
};

const routes = [
  { name: "settings", component: SettingsContainer },
  { name: "firstSubscription", component: FirstSubscriptionContainer },
  { name: "confirmation", component: Confirmation },
];

function getComponent(componentName: string) {
  const component = routes.find((e) => e.name === componentName);
  return component?.component;
}

const ModalRouter: React.FC<ModalState & { onClose(): void }> = ({
  componentName,
  props,
  onClose,
}) => {
  if (!componentName) {
    return null;
  }
  if (componentName === "settings") {
    return <AccountSettingsDialog open onClose={onClose} />;
  }

  if (componentName === "confirmation") {
    return (
      <Modal
        isOpen
        onRequestClose={onClose}
        contentLabel="Confirm action"
        className={styles.dialog}
        overlayClassName={styles.overlay}
        bodyOpenClassName={styles.modalOpen}
        appElement={
          typeof document !== "undefined"
            ? document.getElementById("__next") || undefined
            : undefined
        }
      >
        <Confirmation {...props} onClose={onClose} />
      </Modal>
    );
  }

  const FoundComponent = getComponent(componentName);
  if (!FoundComponent) {
    return null;
  }

  const customStyles = {
    overlay: {
      backgroundColor: "var(--overlay)",
      display: "flex",
    },
    content: {
      position: "initial",
      top: "inherit",
      left: "inherit",
      right: "inherit",
      bottom: "inherit",
      background: "none",
      border: "none",
      padding: 0,
      marginRight: "auto",
      marginLeft: "auto",
      marginTop: "14%",
    },
  } as const;

  return (
    <Modal isOpen={true} onRequestClose={onClose} style={customStyles}>
      <NavHelper>{<FoundComponent {...props} onClose={onClose} />}</NavHelper>
    </Modal>
  );
};

export const ModalContainer: React.FC = () => {
  const dispatch = useAppDispatch();
  const modal = useAppSelector((state) => state.modal);
  const close = () => {
    dispatch(modalActions.close());
  };
  const { componentName, props } = modal;
  return (
    <ModalRouter componentName={componentName} props={props} onClose={close} />
  );
};
