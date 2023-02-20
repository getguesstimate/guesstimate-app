import { useRouter } from "next/router";
import React from "react";

import { CardListElement } from "~/components/utility/Card";
import { DropDown } from "~/components/utility/DropDown";
import { SpaceHeaderButton } from "./SpaceHeaderButton";

const PublicOption: React.FC<{ isSelected: boolean; onClick(): void }> = ({
  isSelected,
  onClick,
}) => (
  <CardListElement
    isSelected={isSelected}
    onMouseDown={isSelected ? () => {} : onClick}
    icon="globe"
    header="Public"
    closeOnClick={!isSelected}
  >
    <div>This model is visible to everyone. Only you can save changes.</div>
  </CardListElement>
);

const PrivateOption: React.FC<any> = ({
  onClick,
  isSelected,
  isPrivateSelectionInvalid,
  editableByMe,
}) => {
  const router = useRouter();
  return (
    <CardListElement
      isSelected={isSelected}
      onMouseDown={!isSelected && onClick}
      icon="lock"
      header="Private"
      isDisabled={isPrivateSelectionInvalid}
      closeOnClick={!isSelected}
    >
      <div>
        {editableByMe
          ? "This model is only visible and editable by you."
          : "You have been given view access to this model."}
      </div>
      {isPrivateSelectionInvalid && (
        <div className="mt-2">
          <a href="/pricing">Upgrade</a> for more private models.
        </div>
      )}
    </CardListElement>
  );
};

export const PrivacyToggle: React.FC<any> = ({
  editableByMe,
  isPrivateSelectionInvalid,
  isPrivate,
  onPublicSelect,
  onPrivateSelect,
}) => {
  const privacyHeader = (
    <SpaceHeaderButton
      iconName={isPrivate ? "lock" : "globe"}
      text={isPrivate ? "Private" : "Public"}
    />
  );

  return (
    <DropDown
      headerText="Privacy Options"
      openLink={privacyHeader}
      position="left"
      width="wide"
    >
      {(!isPrivate || editableByMe) && (
        <PublicOption isSelected={!isPrivate} onClick={onPublicSelect} />
      )}
      {(isPrivate || editableByMe) && (
        <PrivateOption
          isSelected={isPrivate}
          onClick={onPrivateSelect}
          isPrivateSelectionInvalid={isPrivateSelectionInvalid}
          hideErrorWhenUnselected={false}
          editableByMe={editableByMe}
        />
      )}
    </DropDown>
  );
};
