import Modal from "react-modal";

import FirstSubscriptionContainer from "~/components/subscriptions/FirstSubscription/container";
import SettingsContainer from "~/components/users/settings/container";
import { NavHelper } from "~/components/utility/NavHelper/index";
import { useAppDispatch, useAppSelector } from "~/modules/hooks";
import * as modalActions from "~/modules/modal/actions";
import { ModalState } from "./reducer";

const Confirmation: React.FC<{
  message: string;
  onConfirm(): void;
  onClose(): void;
}> = ({ message, onConfirm, onClose }) => {
  return (
    <div className="MainConfirmation">
      <h1>{message}</h1>
      <button className="ui button primary large" onClick={onConfirm}>
        Confirm
      </button>
      <button className="ui button grey large" onClick={onClose}>
        Cancel
      </button>
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

  const FoundComponent = getComponent(componentName);
  if (!FoundComponent) {
    return null;
  }

  const customStyles = {
    overlay: {
      backgroundColor: "rgba(55, 68, 76, 0.6)",
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
