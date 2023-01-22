import Icon from "~/components/react-fa-patched";

export const SpaceHeaderButton: React.FC<{
  iconName: string;
  text: string;
}> = ({ iconName, text }) => (
  <div className="flex items-center space-x-1 px-3 py-2 rounded bg-white/20 hover:bg-white/25 active:bg-white/30 text-bold">
    <Icon className="text-white" name={iconName} />
    <span className="text-white text-sm font-semibold select-none">{text}</span>
  </div>
);
