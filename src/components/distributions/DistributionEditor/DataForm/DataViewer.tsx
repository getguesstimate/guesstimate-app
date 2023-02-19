import clsx from "clsx";
import _ from "lodash";
import React, { useState } from "react";

import Icon from "~/components/react-fa-patched";

import { SmallButtonClose } from "~/components/utility/buttons/close";

export const SmallDataViewer: React.FC<{
  onDelete(): void;
  onOpen(): void;
}> = ({ onDelete, onOpen }) => (
  <div className="flex justify-between items-center pr-2">
    <div
      className="text-purple-2 bg-purple-3 cursor-pointer px-2 py-1 text-sm rounded-sm font-bold"
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
    className="flex gap-1 items-center text-white/70 hover:text-white"
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
  <div className="flex items-center justify-between group">
    <h2 className="m-0 text-white text-lg">
      <Icon name="bar-chart" /> Custom Data
    </h2>
    {!editing && (
      <div className="gap-4 hidden group-hover:flex">
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
        className="min-h-[8em] h-[16em] p-4"
        value={value}
        onChange={handleChange}
      />
      <div>
        <div className="ui button primary tiny" onClick={handleSave}>
          Save
        </div>
        <div className="ui button tiny !bg-[#c6c6c6]" onClick={onEditCancel}>
          Cancel
        </div>
      </div>
    </div>
  );
};

const Viewer: React.FC<{ data: number[] }> = ({ data }) => (
  <ul className="text-purple-2 pl-4">
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
      <div className="px-4 py-2 bg-purple-2 rounded-t">
        <Header onDelete={onDelete} onEdit={handleEdit} editing={editing} />
      </div>
      <div
        className={clsx(
          "bg-purple-3 rounded-b p-4 max-h-96 overflow-auto",
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
