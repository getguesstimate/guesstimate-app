import React, { useState } from "react";

import Icon from "~/components/react-fa-patched";
import { Button } from "~/components/utility/buttons/button";
import { Textarea } from "~/components/utility/forms";

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
    <div>
      <header className="flex items-center justify-between">
        <h2 className="text-xl font-bold leading-none">Import SLURP</h2>
        <div
          className="cursor-pointer text-2xl text-blue-4"
          onClick={() => {
            elev.open(elev.SIPS_AND_SLURPS);
          }}
        >
          <Icon name="question-circle" />
        </div>
      </header>
      <div className="mt-2 flex flex-col items-start gap-2">
        <Textarea
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
          }}
          tabIndex={2}
          theme="padded"
          wide
        />
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
