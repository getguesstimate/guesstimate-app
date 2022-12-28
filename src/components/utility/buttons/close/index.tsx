import React from "react";

import { Button } from "../button";

export const ButtonClose: React.FC<{ onClick(): void }> = ({ onClick }) => (
  <a className="button-close" onClick={onClick}>
    <i className="ion-md-close" />
  </a>
);

export const ButtonCloseText: React.FC<{ onClick(): void }> = ({ onClick }) => (
  <Button onClick={onClick}>
    <i className="ion-md-close" />
    Close
  </Button>
);
