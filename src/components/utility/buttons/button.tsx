import clsx from "clsx";
import { useRouter } from "next/router";
import React from "react";
import Icon from "~/components/react-fa-patched";

type ButtonProps = {
  onClick(): void;
  // dark-grey is for colored background, e.g. "Cancel" in DataViewer editor
  color?: "grey" | "dark-grey" | "red" | "blue" | "green" | "dark";
  size?: "small" | "normal" | "padded" | "large" | "huge";
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
      size === "padded" && "px-6 py-3",
      size === "large" && "px-6 py-3 text-lg",
      size === "huge" && "px-8 py-4 text-xl",
      wide ? "flex w-full" : "inline-flex",
      "items-center",
      "rounded",
      color === "red" && [
        "bg-danger-solid text-on-accent",
        !disabled && "hover:bg-danger-solid-hover",
      ],
      color === "blue" && [
        "bg-accent-solid text-on-accent",
        !disabled && "hover:bg-accent-solid-hover",
      ],
      color === "grey" && [
        "bg-border text-ink-strong/60",
        !disabled && "hover:bg-border-strong hover:text-ink-strong/80",
      ],
      color === "dark-grey" && [
        "bg-surface-hover text-ink",
        !disabled && "hover:bg-border",
      ],
      color === "dark" && [
        "bg-inverse-surface text-on-accent",
        !disabled && "hover:bg-inverse-surface",
      ],
      color === "green" && [
        "bg-success-solid text-on-accent",
        !disabled && "hover:bg-success-solid-hover",
      ],
      disabled && "opacity-70",
      "select-none font-bold leading-none outline-none transition duration-100",
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

export const ButtonWithIcon: React.FC<
  Omit<ButtonProps, "children"> & { text: string; icon: React.ReactNode }
> = ({ text, icon, ...rest }) => {
  return (
    <Button {...rest}>
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
