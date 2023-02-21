import clsx from "clsx";
import React, { PropsWithChildren } from "react";

import Icon from "~/components/react-fa-patched";

import { ButtonClose } from "~/components/utility/buttons/close";
import { capitalizeFirstLetter } from "~/lib/string";
import { HR } from "./HR";

const IconSection: React.FC<
  Pick<CardListElementProps, "icon" | "ionicIcon" | "image" | "imageShape"> & {
    size: "normal" | "large";
  }
> = ({ icon, ionicIcon, image, imageShape, size }) => (
  <div className="text-grey-2 text-center">
    {icon && (
      <Icon
        name={icon}
        className={clsx(size === "large" ? "text-4xl" : "text-xl")}
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

const ChildrenSection: React.FC<
  PropsWithChildren<{
    header: string;
  }>
> = ({ header, children }) => (
  <div className="text-[#555]">
    {header && (
      <div className="font-bold text-xl leading-none">
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
  onMouseDown(): void;
  icon?: string;
  ionicIcon?: string;
  imageShape?: "circle" | "square";
  url?: string;
  header: string;
  image?: string;
}>;

export const CardListElement: React.FC<CardListElementProps> = ({
  icon,
  ionicIcon,
  image,
  imageShape,
  header,
  children,
  url,
  isSelected,
  isDisabled,
  onMouseDown,
}) => {
  const handleSelect = (e: React.MouseEvent) => {
    if (!isDisabled && onMouseDown) {
      console.log("prevented");
      e.preventDefault();
      onMouseDown();
    }
  };

  const className = clsx(
    "grid grid-cols-12 py-2 px-4 gap-2 items-center",
    isSelected && "bg-grey-1",
    isDisabled ? "cursor-not-allowed" : "hover:bg-blue-2 cursor-pointer",
    children && "pt-4 pb-2"
  );

  const [leftCol, rightCol] = children
    ? ["col-span-2", "col-span-10"]
    : ["col-span-3", "col-span-9"];

  const hasImage = !!icon || !!ionicIcon || !!image;

  return (
    <li>
      <a className={className} href={url} onMouseDown={handleSelect}>
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

export const CardHeader: React.FC<PropsWithChildren> = ({ children }) => (
  <h3 className="text-grey-888 font-extralight m-0">{children}</h3>
);

type Props = PropsWithChildren<{
  headerText?: string;
  width: "normal" | "narrow";
  onClose(): void;
  hasPadding?: boolean;
}>;

export const Card: React.FC<Props> = ({
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
        "bg-white rounded shadow drop-shadow",
        "py-1",
        hasPadding && "px-4"
      )}
    >
      {headerText && (
        <div className="text-center mt-2 mb-2 relative">
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
        {headerText && <HR />}
        {children}
      </div>
    </div>
  );
};
