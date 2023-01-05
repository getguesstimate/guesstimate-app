import clsx from "clsx";
import React, { Component } from "react";

import Icon from "~/components/react-fa-patched";

import { ButtonClose } from "~/components/utility/buttons/close/index";
import { capitalizeFirstLetter } from "~/lib/string";

export const CardListSection: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => <div className="CardListSection">{children}</div>;

export type CardListElementProps = {
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
  children?: React.ReactNode;
};

export class CardListElement extends Component<CardListElementProps> {
  static defailtProps = {
    imageShape: "square",
  };

  _onSelect() {
    const { isSelected, isDisabled } = this.props;
    if (!isDisabled) {
      this.props.onMouseDown();
    }
  }

  render() {
    const {
      icon,
      ionicIcon,
      image,
      imageShape,
      header,
      children,
      url,
      isSelected,
      isDisabled,
    } = this.props;

    let className = "action";
    if (isSelected) {
      className += " selected";
    }
    if (isDisabled) {
      className += " disabled";
    }
    if (!!children) {
      className += " hasChildren";
    }

    let [small, large] = !!children ? ["2", "10"] : ["3", "9"];

    const hasImage = !!icon || !!ionicIcon || !!image;

    return (
      <li>
        <a
          className={className}
          href={url}
          onMouseDown={this._onSelect.bind(this)}
        >
          <div className="row middle-xs">
            {hasImage && (
              <IconSection
                {...{ icon, ionicIcon, image, imageShape }}
                colCount={small}
              />
            )}
            <ChildrenSection
              {...{ header, children }}
              colCount={hasImage ? large : "12"}
            />
          </div>
        </a>
      </li>
    );
  }
}

const IconSection: React.FC<
  Pick<CardListElementProps, "icon" | "ionicIcon" | "image" | "imageShape"> & {
    colCount: string;
  }
> = ({ colCount, icon, ionicIcon, image, imageShape }) => (
  <div className={`col-xs-${colCount} icons`}>
    {icon && <Icon name={icon} />}
    {ionicIcon && <i className={`ion-${ionicIcon}`} />}
    {image && <img src={image} className={imageShape} />}
  </div>
);

const ChildrenSection: React.FC<{
  colCount: string;
  header: string;
  children: React.ReactNode;
}> = ({ colCount, header, children }) => (
  <div className={`col-xs-${colCount} info-section`}>
    {!!header && (
      <span className="header">{capitalizeFirstLetter(header)}</span>
    )}
    {!!children && <div className="content"> {children} </div>}
  </div>
);

type Props = {
  headerText?: string;
  width: string;
  onClose(): void;
  shadow: boolean;
  hasPadding?: boolean;
  children: React.ReactNode;
};

export const Card: React.FC<Props> = ({
  headerText,
  onClose,
  width,
  shadow,
  hasPadding,
  children,
}) => {
  return (
    <div className={clsx("Card", width, shadow && "shadow")}>
      {headerText && (
        <div className="Card-header">
          <h3>{headerText}</h3>
          <span className="Card-close">
            <ButtonClose onClick={onClose} />
          </span>
        </div>
      )}

      <div className={clsx("Card-body", hasPadding && "padded")}>
        {headerText && <hr />}
        {children}
      </div>
    </div>
  );
};
