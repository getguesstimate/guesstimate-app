import React from "react";
import { useRouter } from "next/router";

import DropDown from "gComponents/utility/drop-down/index";
import { CardListElement } from "gComponents/utility/card/index";

const PublicOption = ({ isSelected, onClick }) => (
  <CardListElement
    isSelected={isSelected}
    onMouseDown={!isSelected && onClick}
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
      icon={"lock"}
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
        <div className="warning">
          <span className="upgrade" onClick={() => router.push("/pricing")}>
            Upgrade
          </span>
          {" for more private models."}
        </div>
      )}
    </CardListElement>
  );
};

export const PrivacyToggle: React.FC<any> = ({
  editableByMe,
  isPrivateSelectionInvalid,
  openLink,
  isPrivate,
  onPublicSelect,
  onPrivateSelect,
}) => (
  <DropDown
    headerText="Privacy Options"
    openLink={openLink}
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
      />
    )}
  </DropDown>
);
