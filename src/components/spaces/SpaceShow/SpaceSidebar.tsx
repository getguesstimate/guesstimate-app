import React, { Component } from "react";

import { ClickToEdit } from "~/components/utility/ClickToEdit";
import { MarkdownViewer } from "~/components/utility/MarkdownViewer";
import { ButtonCloseText } from "~/components/utility/buttons/close";

type Props = {
  description: string;
  canEdit: boolean;
  onClose(): void;
  onSaveDescription(s: string): void;
};

export const SpaceSidebar: React.FC<Props> = ({
  description,
  canEdit,
  onClose,
  onSaveDescription,
}) => {
  return (
    <div className="SpaceSidebar mx-4 my-6 w-[22em] p-4 bg-white/80 rounded-sm overflow-auto">
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
