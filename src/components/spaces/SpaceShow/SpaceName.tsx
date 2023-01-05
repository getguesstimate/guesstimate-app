import _ from "lodash";
import React, { useRef } from "react";

import { DropDown } from "~/components/utility/DropDown";

type Props = {
  name: string;
  onSave(name: string): void;
  editableByMe: boolean;
};

export const SpaceName: React.FC<Props> = ({ onSave, name, editableByMe }) => {
  const dropDownRef = useRef<DropDown | null>(null);
  const nameRef = useRef<HTMLTextAreaElement | null>(null);

  const focusForm = () => {
    nameRef.current?.focus();
  };
  const onClickSave = () => {
    if (!nameRef.current) {
      return;
    }
    onSave(nameRef.current.value);
    dropDownRef.current?._close();
  };

  const hasName = !_.isEmpty(name);
  const className = `text-editable ${hasName ? "" : "default-value"}`;
  const showName = hasName ? name : "Untitled Model";
  return (
    <span>
      {editableByMe ? (
        <DropDown
          headerText={hasName ? "Rename Model" : "Name Model"}
          openLink={<h1 className={className}> {showName} </h1>}
          position="right"
          hasPadding={true}
          width="wide"
          onOpen={focusForm}
          ref={dropDownRef}
        >
          <div className="ui form">
            <textarea defaultValue={name} rows={2} ref={nameRef} />
            {!hasName && (
              <p>
                What are you trying to estimate? Be specific, so others can
                understand. Example: 'The time it will take George to walk
                home.'
              </p>
            )}
            <div className="ui button primary large" onClick={onClickSave}>
              {hasName ? "Rename Model" : "Name Model"}
            </div>
          </div>
        </DropDown>
      ) : (
        <h1> {name} </h1>
      )}
    </span>
  );
};
