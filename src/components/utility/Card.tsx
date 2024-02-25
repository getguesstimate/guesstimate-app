import React, { FC, PropsWithChildren } from "react";

import clsx from "clsx";
import Icon from "~/components/react-fa-patched";
import { ButtonClose } from "~/components/utility/buttons/close";
import { capitalizeFirstLetter } from "~/lib/string";

import { HR } from "./HR";

const IconSection: FC<
  Pick<CardListElementProps, "icon" | "ionicIcon" | "image" | "imageShape"> & {
    size: "normal" | "large";
  }
> = ({ icon, ionicIcon, image, imageShape, size }) => (
  <div className="text-center text-grey-2">
    {icon && (
      <Icon
        name={icon}
        className={clsx(
          "leading-none",
          size === "large" ? "text-4xl" : "text-lg"
        )}
      />
    )}
    {ionicIcon && <i className={`text-2xl ion-${ionicIcon}`} />}
    {image && (
      <img
        src={image}
        className={clsx(imageShape === "circle" && "rounded-full", "w-9")}
      />
    )}
  </div>
);

const ChildrenSection: FC<
  PropsWithChildren<{
    header: string;
  }>
> = ({ header, children }) => (
  <div className="text-[#555]">
    {header && (
      <div className="text-lg font-bold leading-none">
        {capitalizeFirstLetter(header)}
      </div>
    )}
    {children && <div className="py-2">{children}</div>}
  </div>
);

export type CardListElementProps = PropsWithChildren<{
  isSelected?: boolean;
  isDisabled?: boolean;
  closeOnClick?: boolean; // used by <Dropdown />
  onClick(): void;
  icon?: string;
  ionicIcon?: string;
  imageShape?: "circle" | "square";
  url?: string;
  header: string;
  image?: string;
}>;

export const CardListElement: FC<CardListElementProps> = ({
  icon,
  ionicIcon,
  image,
  imageShape,
  header,
  children,
  url,
  isSelected,
  isDisabled,
  onClick,
}) => {
  const handleSelect = (e: React.MouseEvent) => {
    if (!isDisabled && onClick) {
      e.preventDefault();
      onClick();
    }
  };

  const className = clsx(
    "grid grid-cols-12 px-4 gap-2 items-center",
    isSelected && "bg-grey-1",
    isDisabled ? "cursor-not-allowed" : "hover:bg-blue-2 cursor-pointer",
    children ? "pt-4 pb-2" : "py-2"
  );

  const [leftCol, rightCol] = children
    ? ["col-span-2", "col-span-10"]
    : ["col-span-3", "col-span-9"];

  const hasImage = !!icon || !!ionicIcon || !!image;

  return (
    <li>
      <a className={className} href={url} onClick={handleSelect}>
        {hasImage && (
          <div className={leftCol}>
            <IconSection
              {...{ icon, ionicIcon, image, imageShape }}
              size={children ? "large" : "normal"}
            />
          </div>
        )}
        <div className={clsx(hasImage ? rightCol : "col-span-12")}>
          <ChildrenSection header={header}>{children}</ChildrenSection>
        </div>
      </a>
    </li>
  );
};

export const CardHeader: FC<PropsWithChildren> = ({ children }) => (
  <header className="text-lg font-light text-grey-888">{children}</header>
);

type Props = PropsWithChildren<{
  headerText?: string;
  width: "normal" | "narrow";
  onClose(): void;
  hasPadding?: boolean;
}>;

export const Card: FC<Props> = ({
  headerText,
  onClose,
  width,
  hasPadding,
  children,
}) => {
  return (
    <div
      className={clsx(
        width === "narrow" ? "w-64" : "w-96",
        "rounded bg-white shadow drop-shadow",
        "py-1",
        hasPadding && "px-4"
      )}
    >
      {headerText && (
        <div className="relative mt-1 mb-2 text-center">
          <CardHeader>{headerText}</CardHeader>
          <div
            className={clsx(
              "absolute inset-y-0 grid place-items-center",
              hasPadding ? "right-0" : "right-3"
            )}
          >
            <ButtonClose onClick={onClose} />
          </div>
        </div>
      )}

      <div>
        {headerText && (
          <div className="mb-1">
            <HR />
          </div>
        )}
        {children}
      </div>
    </div>
  );
};
