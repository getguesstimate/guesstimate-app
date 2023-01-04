import React from "react";

import Icon from "~/components/react-fa-patched";

import ClickToEdit from "~/components/utility/click-to-edit/index";
import { MarkdownViewer } from "~/components/utility/markdown-viewer/index";

const GuesstimateDescription: React.FC<{
  value: string;
  onChange(value: string): void;
}> = ({ value, onChange }) => (
  <div className="GuesstimateDescription">
    <ClickToEdit
      viewing={<MarkdownViewer source={value} />}
      emptyValue={
        <span className="emptyValue">
          <Icon name="align-left" />
          Describe your reasoning...
        </span>
      }
      editingSaveText={"Save"}
      onSubmit={onChange}
      value={value}
      canEdit={true}
    />
  </div>
);

export default GuesstimateDescription;
