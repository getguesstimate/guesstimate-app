import React, { useCallback, useRef, useState } from "react";

import ReactDOM from "react-dom";
import Icon from "~/components/react-fa-patched";

import { ButtonClose } from "./buttons/close/index";

const EditingMode: React.FC<{
  value: string | undefined;
  onSubmit(value: string): void;
  onClose(): void;
  editingSaveText: string;
}> = ({ value, onSubmit, onClose, editingSaveText }) => {
  const textInput = useRef<HTMLTextAreaElement | null>(null);

  const submit = () => {
    const value = textInput.current?.value || "";
    onSubmit(value);
    onClose();
  };

  return (
    <div className="EditingMode">
      <textarea
        defaultValue={value}
        ref={(ref) => {
          ref && (ReactDOM.findDOMNode(ref) as any).select();
          textInput.current = ref;
        }}
      />
      <div className="submit-section">
        <div className="submit ui button primary" onClick={submit}>
          {editingSaveText}
        </div>
        <div className="submit-section-close">
          <ButtonClose onClick={onClose} />
        </div>
        <a className="markdown-help">
          <i className="ion-logo-markdown markdown-icon" />
        </a>
      </div>
    </div>
  );
};

const ViewingMode: React.FC<{
  canEdit: boolean;
  onEdit(): void;
  children: React.ReactNode;
}> = ({ canEdit, onEdit, children }) => {
  return (
    <div className="ViewingMode">
      <div className="row">
        {canEdit && (
          <div className="col-sm-12 header">
            Reasoning
            <span className="editLink" onClick={onEdit}>
              <Icon name="pencil" />
            </span>
          </div>
        )}
        <div className="col-sm-12 content">{children}</div>
      </div>
    </div>
  );
};

type Props = {
  value: string;
  editingSaveText: string;
  onSubmit(text: string): void;
  emptyValue: React.ReactNode;
  canEdit: boolean;
  viewing: React.ReactNode;
};

export const ClickToEdit: React.FC<Props> = ({
  value,
  editingSaveText,
  onSubmit,
  emptyValue,
  viewing,
  canEdit,
}) => {
  const [isEditing, setIsEditing] = useState(false);

  const open = useCallback(() => {
    setIsEditing(true);
  }, []);

  const close = useCallback(() => {
    setIsEditing(false);
  }, []);

  return (
    <span className="ClickToEdit">
      {isEditing ? (
        <EditingMode
          value={value}
          editingSaveText={editingSaveText}
          onSubmit={onSubmit}
          onClose={close}
        />
      ) : value === "" ? (
        <div className="BlankMode" onClick={open}>
          {emptyValue}
        </div>
      ) : (
        <ViewingMode canEdit={canEdit} onEdit={open}>
          {viewing}
        </ViewingMode>
      )}
    </span>
  );
};
