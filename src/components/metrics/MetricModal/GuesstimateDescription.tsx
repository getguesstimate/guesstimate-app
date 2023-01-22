import React from "react";

import Icon from "~/components/react-fa-patched";

import { ClickToEdit } from "~/components/utility/ClickToEdit";
import { MarkdownViewer } from "~/components/utility/MarkdownViewer";

export const GuesstimateDescription: React.FC<{
  value: string;
  onChange(value: string): void;
}> = ({ value, onChange }) => (
  <div className="text-xl">
    <ClickToEdit
      viewing={<MarkdownViewer source={value} />}
      emptyValue={
        <span className="flex items-center gap-2">
          <Icon name="align-left" />
          <span>Describe your reasoning...</span>
        </span>
      }
      editingSaveText="Save"
      onSubmit={onChange}
      value={value}
      canEdit={true}
    />
  </div>
);
