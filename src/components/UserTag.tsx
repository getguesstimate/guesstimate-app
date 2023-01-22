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
        "flex items-center cursor-pointer rounded-sm transition-colors h-8",
        bg === "GREY"
          ? "bg-[rgb(147,159,169)]/70 hover:bg-[rgb(88,110,127)]/70"
          : "bg-white/20"
      )}
    >
      {picture && <img className="rounded-l-sm w-8 h-8" src={picture} />}
      <div className="text-white text-lg font-extrabold leading-none px-2">
        {name}
      </div>
    </a>
  );
};
