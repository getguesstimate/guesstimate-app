import Modal from "react-modal";

import { FirstSubscriptionContainer } from "~/components/subscriptions/FirstSubscription/container";
import { SettingsContainer } from "~/components/users/settings/SettingsContainer";
import { Button } from "~/components/utility/buttons/button";
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
    <div className="bg-white px-16 py-12 max-w-xl">
      <header className="mb-8 text-center text-2xl text-grey-333 leading-relaxed">
        {message}
      </header>
      <div className="flex gap-4 justify-center">
        <Button size="large" color="blue" onClick={onConfirm}>
          Confirm
        </Button>
        <Button size="large" onClick={onClose}>
          Cancel
        </Button>
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
