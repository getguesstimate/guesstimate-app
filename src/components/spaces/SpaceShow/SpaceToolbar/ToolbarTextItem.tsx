import { FC } from "react";

import { ToolbarActionBox } from "./ToolbarActionBox";

type Props = {
  onClick?(): void;
  text: string;
};

export const ToolbarTextItem: FC<Props> = ({ onClick, text }) => (
  <ToolbarActionBox onClick={onClick}>{text}</ToolbarActionBox>
);
