import React from "react";

import Icon from "~/components/react-fa-patched";

import { ClickToEdit } from "~/components/utility/ClickToEdit";
import { MarkdownViewer } from "~/components/utility/MarkdownViewer";

export const GuesstimateDescription: React.FC<{
  value: string;
  onChange(value: string): void;
}> = ({ value, onChange }) => (
  <ClickToEdit
    viewing={<MarkdownViewer source={value} />}
    emptyValue={
      <div className="flex items-center gap-2">
        <Icon name="align-left" className="no-underline" />
        <div>Describe your reasoning...</div>
      </div>
    }
    editingSaveText="Save"
    onSubmit={onChange}
    value={value}
    canEdit={true}
  />
);
