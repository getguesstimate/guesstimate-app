import React, { useState } from "react";

import Icon from "~/components/react-fa-patched";

import * as spaceActions from "~/modules/spaces/actions";

import { ButtonCloseText } from "~/components/utility/buttons/close";
import { ClickToEdit } from "~/components/utility/ClickToEdit";
import { MarkdownViewer } from "~/components/utility/MarkdownViewer";
import { ExtendedDSpace } from "../denormalized-space-selector";
import { useAppDispatch } from "~/modules/hooks";

const ClosedLeftSidebar: React.FC<{ onOpen(): void }> = React.memo(
  ({ onOpen }) => {
    return (
      <div className="pl-1 pt-2">
        <div
          className="!p-2 !bg-blue-1 ui button blue small open"
          onClick={onOpen}
        >
          <Icon name="chevron-right" />
        </div>
      </div>
    );
  }
);

const OpenLeftSidebar: React.FC<{
  description: string;
  canEdit: boolean;
  onClose(): void;
  onSaveDescription(s: string): void;
}> = ({ description, canEdit, onClose, onSaveDescription }) => {
  return (
    <div className="mx-4 my-6 w-[20em] p-4 bg-white/80 rounded-sm overflow-auto">
      <div className="flex justify-end">
        <ButtonCloseText onClick={onClose} />
      </div>
      <div className="mt-2 break-words">
        <ClickToEdit
          viewing={<MarkdownViewer source={description} />}
          emptyValue="Describe this model..."
          editingSaveText="Save"
          onSubmit={onSaveDescription}
          canEdit={canEdit}
          value={description}
        />
      </div>
    </div>
  );
};

export const LeftSidebar: React.FC<{
  space: ExtendedDSpace;
}> = ({ space }) => {
  const [isOpen, setIsOpen] = useState(true);

  const dispatch = useAppDispatch();

  const onSaveDescription = (description: string) => {
    dispatch(spaceActions.update(space.id, { description }));
  };

  return isOpen ? (
    <OpenLeftSidebar
      description={space.description || ""}
      canEdit={space.editableByMe}
      onClose={() => setIsOpen(false)}
      onSaveDescription={onSaveDescription}
    />
  ) : (
    <ClosedLeftSidebar onOpen={() => setIsOpen(true)} />
  );
};
