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
    <div>
      <textarea
        className="w-full p-2 rounded outline-none border-2 border-solid border-blue-5 focus:border-blue-1 min-h-[120px]"
        defaultValue={value}
        ref={(ref) => {
          ref && (ReactDOM.findDOMNode(ref) as any).select();
          textInput.current = ref;
        }}
      />
      <div className="mt-2 flex justify-between items-start">
        <div className="flex gap-4">
          <div className="submit ui button primary" onClick={submit}>
            {editingSaveText}
          </div>
          <ButtonClose onClick={onClose} />
        </div>
        <i className="ion-logo-markdown text-5xl leading-8 block cursor-pointer text-grey-4 hover:text-grey-888" />
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
    <div>
      {canEdit && (
        <div className="flex gap-2 items-center mb-1">
          <span className="text-grey-666">Reasoning</span>
          <span
            className="text-grey-666 cursor-pointer p-1 hover:text-black hover:bg-grey-999"
            onClick={onEdit}
          >
            <Icon name="pencil" />
          </span>
        </div>
      )}
      <div className="text-grey-333">{children}</div>
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
    <div className="ClickToEdit">
      {isEditing ? (
        <EditingMode
          value={value}
          editingSaveText={editingSaveText}
          onSubmit={onSubmit}
          onClose={close}
        />
      ) : value === "" ? (
        <div
          className="p-2 rounded text-grey-999 hover:text-grey-333 underline cursor-pointer hover:bg-black/20"
          onClick={open}
        >
          {emptyValue}
        </div>
      ) : (
        <ViewingMode canEdit={canEdit} onEdit={open}>
          {viewing}
        </ViewingMode>
      )}
    </div>
  );
};
