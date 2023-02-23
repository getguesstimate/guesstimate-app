import clsx from "clsx";
import React, { useState } from "react";

import Icon from "~/components/react-fa-patched";
import { Button } from "~/components/utility/buttons/button";

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
      <div className="flex justify-between items-center">
        <h2 className="font-bold text-xl leading-none">Import SLURP</h2>
        <div
          className="text-blue-4 text-2xl cursor-pointer"
          onClick={() => {
            elev.open(elev.SIPS_AND_SLURPS);
          }}
        >
          <Icon name="question-circle" />
        </div>
      </div>
      <div className="ui form mt-2">
        <div className="field">
          <textarea
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
            }}
            tabIndex={2}
          />
        </div>
        <Button
          color="blue"
          size="large"
          disabled={!isValid()}
          onClick={handleSubmit}
        >
          Import
        </Button>
      </div>
    </div>
  );
};
