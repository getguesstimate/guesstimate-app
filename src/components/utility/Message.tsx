import clsx from "clsx";
import { PropsWithChildren } from "react";

type Props = PropsWithChildren<{
  title?: string;
  size?: "large" | "normal";
  theme?: "default" | "error" | "success";
}>;

export const Message: React.FC<Props> = ({
  title,
  size = "normal",
  theme = "default",
  children,
}) => {
  return (
    <div
      className={clsx("max-w-3xl rounded border p-4", [
        theme === "default" && "border-grey-ccc bg-white",
        theme === "error" && "border-red-1 bg-red-2 text-red-4",
        theme === "success" && "border-green-8 bg-green-7 text-green-6",
      ])}
    >
      {title && (
        <header
          className={clsx(
            "font-bold leading-tight",
            size === "large" && "mb-4 text-3xl",
            size === "normal" && "mb-2 text-lg"
          )}
        >
          {title}
        </header>
      )}
      <div className={clsx(size === "normal" && "text-sm")}>{children}</div>
    </div>
  );
};
