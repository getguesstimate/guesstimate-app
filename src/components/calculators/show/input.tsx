import _ from "lodash";
import React, { useEffect, useImperativeHandle, useRef, useState } from "react";

import ReactMarkdown from "react-markdown";
import Icon from "~/components/react-fa-patched";

import { Guesstimator } from "~/lib/guesstimator/index";

import { ContentState, Editor, EditorState } from "draft-js";

export type InputHandle = {
  getContent(): string;
  blur(): void;
  hasValidContent: boolean;
};

type Props = {
  id: string;
  initialValue: string;
  name: string | undefined;
  description: string | undefined;
  isFirst: boolean;
  onBlur(input: any): void;
  onChange(input: any): void;
  onEnter(id: string): void;
  errors: any[];
};

export const Input = React.forwardRef<InputHandle, Props>(
  (
    {
      id,
      initialValue,
      name,
      description,
      isFirst,
      onEnter,
      onBlur,
      onChange,
      errors = [],
    },
    ref
  ) => {
    const [editorState, setEditorState] = useState(
      EditorState.createWithContent(
        ContentState.createFromText(initialValue || "")
      )
    );

    const getContent = () => editorState.getCurrentContent().getPlainText("");

    const input = getContent();

    const hasValidContent =
      !_.isEmpty(input) && _.isEmpty(Guesstimator.parse({ input })[0]);

    const editorRef = useRef<Editor | null>(null);

    useImperativeHandle(ref, () => ({
      getContent,
      blur() {
        editorRef.current?.blur();
      },
      hasValidContent,
    }));

    useEffect(() => {
      if (isFirst) {
        setTimeout(() => {
          editorRef.current?.focus();
        }, 1);
      }
    }, []);

    const handleChange = (editorState: any) => {
      onChange(editorState.getCurrentContent().getPlainText(""));
      return setEditorState(editorState);
    };

    const handleBlur = () => {
      onBlur(editorState.getCurrentContent().getPlainText(""));
    };

    return (
      <div className="input">
        <div className="row">
          <div className="col-xs-12 col-sm-7">
            <div className="name">{name}</div>
            {description && (
              <div className="description">
                <ReactMarkdown source={description} />
              </div>
            )}
          </div>
          <div className="col-xs-12 col-sm-5">
            <div className="editor">
              <Editor
                ref={editorRef}
                editorState={editorState}
                onChange={handleChange}
                onBlur={handleBlur}
                handleReturn={() => {
                  onEnter(id);
                  return true;
                }}
              />
              {!_.isEmpty(errors) && (
                <div className="status error">
                  <Icon name="close" />
                </div>
              )}
              {hasValidContent && (
                <div className="status success">
                  <Icon name="check" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
);
