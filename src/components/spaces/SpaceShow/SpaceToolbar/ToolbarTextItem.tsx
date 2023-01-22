import { ToolbarActionBox } from "./ToolbarActionBox";

type Props = {
  onClick?(): void;
  text: string;
};

export const ToolbarTextItem: React.FC<Props> = ({ onClick, text }) => (
  <ToolbarActionBox onClick={onClick}>{text}</ToolbarActionBox>
);
