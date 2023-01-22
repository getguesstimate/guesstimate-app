import React from "react";

import { ButtonWithIcon } from "../button";

export const ButtonClose: React.FC<{ onClick(): void }> = ({ onClick }) => (
  <a className="button-close" onClick={onClick}>
    <i className="ion-md-close" />
  </a>
);

export const ButtonCloseText: React.FC<{ onClick(): void }> = ({ onClick }) => (
  <ButtonWithIcon
    onClick={onClick}
    icon={<i className="ion-md-close" />}
    text="Close"
  />
);
