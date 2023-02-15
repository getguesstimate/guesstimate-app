import React from "react";

import { ButtonWithIcon } from "../button";

export const SmallButtonClose: React.FC<{ onClick(): void }> = ({
  onClick,
}) => (
  <a
    className="cursor-pointer text-grey-ccc hover:text-grey-888 text-xl"
    onClick={onClick}
  >
    <i className="ion-md-close" />
  </a>
);

export const ButtonClose: React.FC<{ onClick(): void }> = ({ onClick }) => (
  <a
    className="cursor-pointer text-grey-bbb hover:text-grey-888 text-3xl"
    onClick={onClick}
  >
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
