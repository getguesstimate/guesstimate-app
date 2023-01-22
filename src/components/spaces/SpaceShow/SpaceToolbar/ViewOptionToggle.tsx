import React from "react";

import Icon from "~/components/react-fa-patched";
import { DropDown } from "~/components/utility/DropDown";
import { CardListElement } from "~/components/utility/Card";

const ViewingOption: React.FC<any> = ({ isSelected, onClick }) => (
  <CardListElement
    isSelected={isSelected}
    onMouseDown={!isSelected && onClick}
    icon="eye"
    header="Viewing"
  >
    <div>You can interact with this model, but no changes will be saved.</div>
  </CardListElement>
);

const EditingOption: React.FC<any> = ({
  onClick,
  isSelected,
  isEditingInvalid,
}) => (
  <CardListElement
    isSelected={isSelected}
    onMouseDown={!isSelected && onClick}
    icon="pencil"
    header="Editing"
    isDisabled={isEditingInvalid}
  >
    <div>All changes will be saved.</div>
    {isEditingInvalid && (
      <div className="warning">You don't have access to save this model.</div>
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
    <div className="flex items-center space-x-1 px-2 py-1 rounded bg-white/30 hover:bg-white/50 text-bold">
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
      <ViewingOption
        isSelected={!isEditing}
        onClick={onForbidEdits}
        closeOnClick={true}
      />
      <EditingOption
        isSelected={isEditing}
        onClick={onAllowEdits}
        isEditingInvalid={isEditingInvalid}
        hideErrorWhenUnselected={false}
        closeOnClick={!isEditingInvalid}
      />
    </DropDown>
  );
};
