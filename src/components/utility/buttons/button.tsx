import clsx from "clsx";
import { useRouter } from "next/router";
import React from "react";
import Icon from "~/components/react-fa-patched";

export const Button: React.FC<{
  onClick(): void;
  color?: "red" | "blue";
  size?: "normal" | "small";
  children: React.ReactNode;
  wide?: boolean;
  loading?: boolean;
  disabled?: boolean;
}> = ({
  onClick,
  color,
  size = "normal",
  wide,
  loading,
  disabled,
  children,
}) => (
  <button
    className={clsx(
      size === "small" ? "px-3 py-2 text-xs" : "px-3 py-2 text-base",
      wide ? "flex w-full" : "inline-flex",
      "items-center",
      "rounded font-lato",
      color === "red"
        ? "text-white bg-[#b74d4d] hover:bg-[#923f3f]"
        : color === "blue"
        ? "text-white bg-blue-1 hover:bg-blue-7"
        : "bg-[#E0E1E2] hover:bg-[#cacbcd] text-[rgb(0,0,0)]/60 hover:text-[rgb(0,0,0)]/80",
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
