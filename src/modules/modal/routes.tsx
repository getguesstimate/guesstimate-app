import { Component } from "react";

import FirstSubscriptionContainer from "gComponents/subscriptions/FirstSubscription/container";
import SettingsContainer from "gComponents/users/settings/container";
import NavHelper from "gComponents/utility/NavHelper/index";
import { useAppDispatch, useAppSelector } from "gModules/hooks";
import * as modalActions from "gModules/modal/actions";
import Modal from "react-modal";

class Confirmation extends Component<any> {
  render() {
    return (
      <div className="MainConfirmation">
        <h1> {this.props.message} </h1>
        <button
          className="ui button primary large"
          onClick={this.props.onConfirm}
        >
          {" "}
          Confirm{" "}
        </button>
        <button className="ui button grey large" onClick={this.props.onClose}>
          {" "}
          Cancel{" "}
        </button>
      </div>
    );
  }
}

const routes = [
  { name: "settings", component: SettingsContainer },
  { name: "firstSubscription", component: FirstSubscriptionContainer },
  { name: "confirmation", component: Confirmation },
];

function getComponent(componentName: string) {
  const component = routes.find((e) => e.name === componentName);
  return component?.component || false;
}

class ModalRouter extends Component<any> {
  render() {
    const { componentName, props } = this.props;
    if (!componentName) {
      return null;
    } else {
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
      };

      const isOpen = true;
      return (
        <Modal
          isOpen={isOpen}
          onRequestClose={this.props.onClose}
          style={customStyles}
        >
          <NavHelper>
            {<FoundComponent {...props} onClose={this.props.onClose} />}
          </NavHelper>
        </Modal>
      );
    }
  }
}

const ModalContainer: React.FC = () => {
  const dispatch = useAppDispatch();
  const modal = useAppSelector((state) => state.modal);
  const _close = () => {
    dispatch(modalActions.close());
  };
  const { componentName, props } = modal;
  return (
    <ModalRouter componentName={componentName} props={props} onClose={_close} />
  );
};

export default ModalContainer;
