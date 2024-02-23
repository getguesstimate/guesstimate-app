import { FC } from "react";

import { ButtonWithIcon } from "../button";

export const SmallButtonClose: FC<{ onClick(): void }> = ({ onClick }) => (
  <a
    className="cursor-pointer text-xl text-grey-ccc hover:text-grey-888"
    onClick={onClick}
  >
    <i className="ion-md-close" />
  </a>
);

export const ButtonClose: FC<{ onClick(): void }> = ({ onClick }) => (
  <a
    className="cursor-pointer text-2xl leading-none text-grey-bbb hover:text-grey-888"
    onClick={onClick}
  >
    <i className="ion-md-close" />
  </a>
);

export const ButtonCloseText: FC<{ onClick(): void }> = ({ onClick }) => (
  <ButtonWithIcon
    onClick={onClick}
    icon={<i className="ion-md-close" />}
    text="Close"
  />
);
