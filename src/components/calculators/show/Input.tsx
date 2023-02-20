import _ from "lodash";
import React, {
  PropsWithChildren,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

import ReactMarkdown from "react-markdown";
import Icon from "~/components/react-fa-patched";

import { Guesstimator } from "~/lib/guesstimator/index";

import { ContentState, Editor, EditorState } from "draft-js";
import { PropagationError } from "~/lib/propagation/errors";

const Status: React.FC<PropsWithChildren> = ({ children }) => (
  <div className="absolute h-4 right-2 top-2">{children}</div>
);

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
  onBlur(input: string): void;
  onChange(input: string): void;
  onEnter(id: string): void;
  errors: PropagationError[];
};

export const Input = React.forwardRef<InputHandle, Props>(function Input(
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
) {
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
    <div className="md:grid md:grid-cols-12">
      <div className="md:col-span-7">{name}</div>
      <div className="md:col-span-5">
        <div className="px-4 py-2 bg-grey-6 border border-grey-ccc rounded-sm relative">
          <Editor
            ref={editorRef}
            editorState={editorState}
            onChange={handleChange}
            onBlur={handleBlur}
            handleReturn={() => {
              onEnter(id);
              return "handled";
            }}
          />
          {!_.isEmpty(errors) && (
            <Status>
              <Icon name="close" className="text-[rgb(206,132,132)]" />
            </Status>
          )}
          {hasValidContent && (
            <Status>
              <Icon name="check" className="text-[#a9a8a8]" />
            </Status>
          )}
        </div>
      </div>
      {description && (
        <div className="md:col-span-7 text-xs mb-8 text-grey-666">
          <ReactMarkdown source={description} />
        </div>
      )}
    </div>
  );
});
