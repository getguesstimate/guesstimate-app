import clsx from "clsx";
import { useRouter } from "next/router";
import React from "react";
import Icon from "~/components/react-fa-patched";

type ButtonProps = {
  onClick(): void;
  color?: "grey" | "dark-grey" | "red" | "blue" | "green"; // dark-grey is for colored background, e.g. "Cancel" in DataViewer editor
  size?: "normal" | "small" | "large" | "huge";
  children: React.ReactNode;
  wide?: boolean;
  loading?: boolean;
  disabled?: boolean;
};

export const Button: React.FC<ButtonProps> = ({
  onClick,
  color = "grey",
  size = "normal",
  wide,
  loading,
  disabled,
  children,
}) => (
  <button
    className={clsx(
      size === "small" && "px-3 py-2 text-xs",
      size === "normal" && "px-4 py-2 text-sm",
      size === "large" && "px-6 py-3 text-lg",
      size === "huge" && "px-8 py-4 text-xl",
      wide ? "flex w-full" : "inline-flex",
      "items-center",
      "rounded",
      color === "red" && [
        "text-white bg-[#b74d4d]",
        !disabled && "hover:bg-[#923f3f]",
      ],
      color === "blue" && [
        "text-white bg-blue-1",
        !disabled && "hover:bg-blue-7",
      ],
      color === "grey" && [
        "bg-[#E0E1E2] text-[rgb(0,0,0)]/60",
        !disabled && "hover:bg-[#cacbcd] hover:text-[rgb(0,0,0)]/80",
      ],
      color === "dark-grey" && [
        "bg-grey-ccc",
        !disabled && "hover:bg-grey-bbb",
      ],
      color === "green" && [
        "text-white bg-green-2",
        !disabled && "hover:bg-green-5",
      ],
      disabled && "opacity-70",
      "select-none font-bold outline-none leading-none transition duration-100",
      loading && "cursor-pointer"
    )}
    disabled={disabled}
    onClick={onClick}
  >
    {loading ? (
      <div className="relative">
        <Icon name="spinner" spin className="absolute inset-0" />
        <div className="invisible">{children}</div>
      </div>
    ) : (
      children
    )}
  </button>
);

export const ButtonWithIcon: React.FC<{
  onClick(): void;
  color?: "red";
  text: string;
  icon: React.ReactNode;
  wide?: boolean;
}> = ({ onClick, color, text, icon, wide }) => {
  return (
    <Button color={color} onClick={onClick} wide={wide}>
      <div className="mr-1">{icon}</div>
      <div>{text}</div>
    </Button>
  );
};

export const ButtonEditText: React.FC<{ onClick(): void }> = ({ onClick }) => (
  <ButtonWithIcon onClick={onClick} icon={<Icon name="pencil" />} text="Edit" />
);

export const ButtonDeleteText: React.FC<{ onClick(): void }> = ({
  onClick,
}) => (
  <ButtonWithIcon
    onClick={onClick}
    color="red"
    icon={<Icon name="warning" />}
    text="Delete"
  />
);

export const ButtonExpandText: React.FC<{ href: string }> = ({ href }) => {
  const router = useRouter();
  const onClick = () => router.push(href);
  return (
    <ButtonWithIcon
      onClick={onClick}
      icon={<i className="ion-ios-redo" />}
      text="Expand"
    />
  );
};
