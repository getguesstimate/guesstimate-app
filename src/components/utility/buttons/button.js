import React from "react";
import Icon from "react-fa";
import "./style.css";

export const Button = ({ onClick, color, children }) => (
  <span className={`ui button g-button ${color}`} onClick={onClick}>
    {children}
  </span>
);

export const ButtonEditText = ({ onClick }) => (
  <Button onClick={onClick}>
    <Icon name="pencil" />
    Edit
  </Button>
);

export const ButtonDeleteText = ({ onClick }) => (
  <Button onClick={onClick} color={"red"}>
    <Icon name="warning" />
    Delete
  </Button>
);

export const ButtonExpandText = ({ onClick }) => (
  <Button onClick={onClick}>
    <i className={`ion-ios-redo`} />
    Expand
  </Button>
);
