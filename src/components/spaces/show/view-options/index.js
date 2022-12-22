import React from "react";

import DropDown from "gComponents/utility/drop-down/index";
import { CardListElement } from "gComponents/utility/card/index";

const ViewingOption = ({ isSelected, onClick }) => (
  <CardListElement
    isSelected={isSelected}
    onMouseDown={!isSelected && onClick}
    icon={"eye"}
    header="Viewing"
  >
    <div>You can interact with this model, but no changes will be saved.</div>
  </CardListElement>
);

const EditingOption = ({ onClick, isSelected, isEditingInvalid }) => (
  <CardListElement
    isSelected={isSelected}
    onMouseDown={!isSelected && onClick}
    icon={"pencil"}
    header="Editing"
    isDisabled={isEditingInvalid}
  >
    <div>All changes will be saved.</div>
    {isEditingInvalid && (
      <div className="warning">You don't have access to save this model.</div>
    )}
  </CardListElement>
);

/*
 *
    <ul className={'ViewOptions dropdown'}>
    */

export const ViewOptionToggle = ({
  isEditingInvalid,
  onForbidEdits,
  onAllowEdits,
  headerText,
  openLink,
  position,
  isEditing,
}) => (
  <DropDown
    headerText={headerText}
    openLink={openLink}
    position={position}
    width={"wide"}
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
