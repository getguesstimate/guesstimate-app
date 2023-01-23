import clsx from "clsx";
import { useRouter } from "next/router";
import React from "react";
import Icon from "~/components/react-fa-patched";

export const Button: React.FC<{
  onClick(): void;
  color?: "red";
  size?: "normal" | "small";
  children: React.ReactNode;
}> = ({ onClick, color, size = "normal", children }) => (
  <button
    className={clsx(
      "rounded font-lato inline-flex items-center",
      size === "small" ? "text-xs px-3 py-2" : "px-3 py-2 text-base",
      color === "red"
        ? "text-white bg-[#b74d4d] hover:bg-[#923f3f]"
        : "bg-[#E0E1E2] hover:bg-[#cacbcd] text-[rgb(0,0,0)]/60 hover:text-[rgb(0,0,0)]/80",
      "select-none cursor-pointer font-bold outline-none leading-none transition duration-100"
    )}
    onClick={onClick}
  >
    {children}
  </button>
);

export const ButtonWithIcon: React.FC<{
  onClick(): void;
  color?: "red";
  text: string;
  icon: React.ReactNode;
}> = ({ onClick, color, text, icon }) => {
  return (
    <Button color={color} onClick={onClick}>
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
