import React, { useState } from "react";

import Icon from "~/components/react-fa-patched";

import * as elev from "~/server/elev/index";

type Props = {
  onSubmit(slurp: any): void;
};

export const ImportFromSlurpForm: React.FC<Props> = ({ onSubmit }) => {
  const [value, setValue] = useState("");

  const handleSubmit = () => {
    onSubmit(JSON.parse(value));
  };

  const isValid = () => {
    try {
      JSON.parse(value);
      return true;
    } catch (e) {
      return false;
    }
  };

  return (
    <div className="ImportFromSlurpForm">
      <h2>Import SLURP</h2>
      <div
        className="SlurpQuestionLink"
        onClick={() => {
          elev.open(elev.SIPS_AND_SLURPS);
        }}
      >
        <Icon name="question-circle" />
      </div>
      <div className="ui form">
        <div className="field">
          <textarea
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
            }}
            tabIndex={2}
            ref="textarea"
          />
        </div>
        <div
          className={`ui button submit ${isValid() ? "blue" : "disabled"}`}
          onClick={handleSubmit}
        >
          Import
        </div>
      </div>
    </div>
  );
};
