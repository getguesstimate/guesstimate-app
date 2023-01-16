import clsx from "clsx";
import _ from "lodash";
import React, { Component, useState } from "react";

import Icon from "~/components/react-fa-patched";

import { ButtonClose } from "~/components/utility/buttons/close";

type Mode = "VIEW" | "EDIT";

export const SmallDataViewer: React.FC<{
  onDelete(): void;
  onOpen(): void;
}> = ({ onDelete, onOpen }) => (
  <div className="DataViewer DataViewer--card">
    <a className="ui button primary small" onClick={onOpen}>
      <Icon name="bar-chart" /> Custom
    </a>
    <ButtonClose onClick={onDelete} />
  </div>
);

const Header: React.FC<{
  onDelete(): void;
  onEdit(): void;
  mode: Mode;
}> = ({ mode, onDelete, onEdit }) => (
  <div className="row">
    <div className="col-sm-6">
      <h2>
        <Icon name="bar-chart" /> Custom Data
      </h2>
    </div>
    {mode === "VIEW" && (
      <div className="col-sm-6">
        <a onClick={onDelete} className="delete">
          <Icon name="close" /> Delete
        </a>
        <a onClick={onEdit} className="edit">
          <Icon name="pencil" /> Edit
        </a>
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
    <div>
      <div className="ui form">
        <div className="field">
          <textarea value={value} onChange={handleChange} />
        </div>
      </div>
      <div className="ui button primary tiny" onClick={handleSave}>
        Save
      </div>
      <div className="ui button tiny" onClick={onEditCancel}>
        Cancel
      </div>
    </div>
  );
};

const Viewer: React.FC<{ data: number[] }> = ({ data }) => (
  <ul>
    {data.map((element, index) => {
      return (
        <li key={index}>
          <div className="DataPoint" key={index}>
            {element}
          </div>
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
  const [mode, setMode] = useState<Mode>("VIEW");

  const bodyClass = clsx(
    "ui segment DataViewer--body",
    mode === "VIEW" ? "view" : "edit"
  );

  const handleEdit = () => {
    setMode("EDIT");
  };

  const handleSave = (data: number[]) => {
    onSave(data);
    setMode("VIEW");
  };

  return (
    <div className="DataViewer ui segments">
      <div className="ui segment DataViewer--header">
        <Header onDelete={onDelete} onEdit={handleEdit} mode={mode} />
      </div>
      <div className={bodyClass}>
        {mode === "VIEW" && <Viewer data={data} />}
        {mode === "EDIT" && (
          <Editor
            data={data}
            onEditCancel={() => {
              setMode("VIEW");
            }}
            onSave={handleSave}
          />
        )}
      </div>
    </div>
  );
};
