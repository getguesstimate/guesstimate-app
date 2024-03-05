import clsx from "clsx";
import _ from "lodash";
import React, { useState } from "react";

import Icon from "~/components/react-fa-patched";
import { Button } from "~/components/utility/buttons/button";

import { SmallButtonClose } from "~/components/utility/buttons/close";

export const SmallDataViewer: React.FC<{
  onDelete(): void;
  onOpen(): void;
}> = ({ onDelete, onOpen }) => (
  <div className="flex items-center justify-between pr-2">
    <div
      className="cursor-pointer rounded-sm bg-purple-3 px-2 py-1 text-sm font-bold text-purple-2"
      onClick={onOpen}
    >
      <Icon name="bar-chart" /> Custom
    </div>
    <SmallButtonClose onClick={onDelete} />
  </div>
);

const HeaderButton: React.FC<{
  onClick(): void;
  text: string;
  icon: string;
}> = ({ onClick, text, icon }) => (
  <a
    onClick={onClick}
    className="flex items-center gap-1 text-white/70 hover:text-white"
    href=""
  >
    <Icon name={icon} className="text-base" />
    <span className="text-sm">{text}</span>
  </a>
);

const Header: React.FC<{
  onDelete(): void;
  onEdit(): void;
  editing: boolean;
}> = ({ editing, onDelete, onEdit }) => (
  <div className="group flex items-center justify-between">
    <h2 className="text-lg text-white">
      <Icon name="bar-chart" /> Custom Data
    </h2>
    {!editing && (
      <div className="hidden gap-4 group-hover:flex">
        <HeaderButton onClick={onEdit} icon="pencil" text="Edit" />
        <HeaderButton onClick={onDelete} icon="close" text="Delete" />
      </div>
    )}
  </div>
);

const Editor: React.FC<{
  data: number[];
  onSave(data: number[]): void;
  onEditCancel(): void;
}> = ({ data, onSave, onEditCancel }) => {
  const [value, setValue] = useState(data.join("\n"));

  const convertToNumbers = (values: string) => {
    return values
      .split(/[\s,]+/)
      .filter((s) => s !== "")
      .map(Number);
  };

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = event.target.value;
    setValue(value);
  };

  const _isValid = () => {
    const numbers = convertToNumbers(value);
    const allValid = _.every(numbers, (e) => _.isFinite(e));
    return allValid;
  };

  const handleSave = () => {
    const numbers = convertToNumbers(value)
      .filter((e) => _.isFinite(e))
      .slice(0, 10000);
    onSave(numbers);
  };

  return (
    <div className="flex flex-col gap-4">
      <textarea
        className="h-[16em] min-h-[8em] p-4"
        value={value}
        onChange={handleChange}
      />
      <div className="flex gap-2 text-sm">
        <Button size="small" color="blue" onClick={handleSave}>
          Save
        </Button>
        <Button size="small" color="dark-grey" onClick={onEditCancel}>
          Cancel
        </Button>
      </div>
    </div>
  );
};

const Viewer: React.FC<{ data: number[] }> = ({ data }) => (
  <ul className="pl-4 text-purple-2">
    {data.map((element, index) => {
      return (
        <li key={index}>
          <div key={index}>{element}</div>
        </li>
      );
    })}
  </ul>
);

type LargeDataViewerProps = {
  data: number[];
  onDelete(): void;
  onSave(data: number[]): void;
};

export const LargeDataViewer: React.FC<LargeDataViewerProps> = ({
  data,
  onDelete,
  onSave,
}) => {
  const [editing, setEditing] = useState(false);

  const handleEdit = () => {
    setEditing(true);
  };

  const handleSave = (data: number[]) => {
    onSave(data);
    setEditing(false);
  };

  return (
    <div className="max-w-sm rounded">
      <div className="rounded-t bg-purple-2 px-4 py-2">
        <Header onDelete={onDelete} onEdit={handleEdit} editing={editing} />
      </div>
      <div
        className={clsx(
          "max-h-96 overflow-auto rounded-b bg-purple-3 p-4",
          editing ? "edit" : "view"
        )}
      >
        {editing ? (
          <Editor
            data={data}
            onEditCancel={() => {
              setEditing(false);
            }}
            onSave={handleSave}
          />
        ) : (
          <Viewer data={data} />
        )}
      </div>
    </div>
  );
};
