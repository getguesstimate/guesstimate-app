import React, { useCallback, useRef, useState } from "react";

import ReactDOM from "react-dom";
import TextareaAutosize from "react-textarea-autosize";

import Icon from "~/components/react-fa-patched";
import { Button } from "./buttons/button";

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
      <TextareaAutosize
        className="min-h-[120px] w-full rounded border-2 border-solid border-blue-5 p-2 outline-none focus:border-blue-1"
        defaultValue={value}
        ref={(ref) => {
          ref && (ReactDOM.findDOMNode(ref) as any).select();
          textInput.current = ref;
        }}
      />
      <div className="mt-2 flex items-start justify-between">
        <div className="flex items-center gap-4">
          <Button color="blue" onClick={submit}>
            {editingSaveText}
          </Button>
          <ButtonClose onClick={onClose} />
        </div>
        <i className="ion-logo-markdown cursor-pointer text-4xl text-grey-4 hover:text-grey-888" />
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
        <div className="mb-1 flex items-center gap-2">
          <div className="text-grey-666">Reasoning</div>
          <div
            className="cursor-pointer rounded-sm px-1 text-grey-666 hover:bg-grey-ccc hover:text-black"
            onClick={onEdit}
          >
            <Icon name="pencil" className="text-lg leading-none" />
          </div>
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
    <div>
      {isEditing ? (
        <EditingMode
          value={value}
          editingSaveText={editingSaveText}
          onSubmit={onSubmit}
          onClose={close}
        />
      ) : value === "" ? (
        <div
          className="cursor-pointer rounded p-2 text-grey-999 underline hover:bg-black/20 hover:text-grey-333"
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
