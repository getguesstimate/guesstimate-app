import clsx from "clsx";

export const UserTag: React.FC<{
  url: string;
  picture?: string;
  name: string;
  bg?: "GREY" | "WHITE";
}> = ({ url, picture, name, bg = "GREY" }) => {
  return (
    <a
      href={url}
      className={clsx(
        "flex h-6 cursor-pointer items-center rounded-sm transition-colors",
        bg === "GREY"
          ? "bg-[rgb(147,159,169)]/70 hover:bg-[rgb(88,110,127)]/70"
          : "bg-white/20"
      )}
    >
      {picture && <img className="h-6 w-6 rounded-l-sm" src={picture} />}
      <div className="flex-none px-2 font-open font-extrabold leading-none text-white">
        {name}
      </div>
    </a>
  );
};
