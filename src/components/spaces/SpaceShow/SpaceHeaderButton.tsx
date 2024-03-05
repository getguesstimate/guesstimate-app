import Icon from "~/components/react-fa-patched";

export const SpaceHeaderButton: React.FC<{
  iconName: string;
  text: string;
}> = ({ iconName, text }) => (
  <div className="text-bold flex items-center space-x-1 rounded bg-white/20 px-3 py-2 hover:bg-white/25 active:bg-white/30">
    <Icon className="text-white" name={iconName} />
    <span className="select-none text-sm font-semibold text-white">{text}</span>
  </div>
);
