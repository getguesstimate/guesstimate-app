import React from "react";

import Icon from "~/components/react-fa-patched";
import { CardListElement } from "~/components/utility/Card";
import { DropDown } from "~/components/utility/DropDown";

const ViewingOption: React.FC<{
  isSelected: boolean;
  onClick(): void;
}> = ({ isSelected, onClick }) => (
  <CardListElement
    isSelected={isSelected}
    onClick={isSelected ? () => {} : onClick}
    icon="eye"
    header="Viewing"
  >
    <div>You can interact with this model, but no changes will be saved.</div>
  </CardListElement>
);

const EditingOption: React.FC<{
  isSelected: boolean;
  isEditingInvalid: boolean;
  onClick(): void;
}> = ({ onClick, isSelected, isEditingInvalid }) => (
  <CardListElement
    isSelected={isSelected}
    onClick={isSelected ? () => {} : onClick}
    icon="pencil"
    header="Editing"
    isDisabled={isEditingInvalid}
  >
    <div>All changes will be saved.</div>
    {isEditingInvalid && (
      <div className="warning">
        {"You don't have access to save this model."}
      </div>
    )}
  </CardListElement>
);

export const ViewOptionToggle: React.FC<{
  isEditingInvalid: boolean;
  isEditing: boolean;
  onAllowEdits(): void;
  onForbidEdits(): void;
}> = ({ isEditingInvalid, onForbidEdits, onAllowEdits, isEditing }) => {
  const openLink = (
    <div className="text-bold flex items-center space-x-1 rounded bg-white/30 px-2 py-1 hover:bg-white/50">
      {isEditing ? (
        <span>
          <Icon name="pencil" /> Editing
        </span>
      ) : (
        <span>
          <Icon name="eye" /> Viewing
        </span>
      )}
    </div>
  );

  return (
    <DropDown
      headerText="Saving Options"
      openLink={openLink}
      position="left"
      width="wide"
    >
      <ViewingOption isSelected={!isEditing} onClick={onForbidEdits} />
      <EditingOption
        isSelected={isEditing}
        onClick={onAllowEdits}
        isEditingInvalid={isEditingInvalid}
      />
    </DropDown>
  );
};
