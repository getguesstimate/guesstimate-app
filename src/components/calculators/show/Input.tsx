import _ from "lodash";
import styles from "../calculator.module.css";
import { FieldHelp } from "~/components/workspace/FieldHelp";
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
  <div className="absolute right-2 top-2 h-4">{children}</div>
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
      const timer = setTimeout(() => {
        editorRef.current?.focus();
      }, 1);
      return () => clearTimeout(timer);
    }
  }, [isFirst]);

  const handleChange = (editorState: any) => {
    onChange(editorState.getCurrentContent().getPlainText(""));
    return setEditorState(editorState);
  };

  const handleBlur = () => {
    onBlur(editorState.getCurrentContent().getPlainText(""));
  };

  return (
    <div className={styles.inputRow}>
      <div className={styles.sectionHeading}>
        <span id={`calculator-input-${id}`} className={styles.inputName}>
          {name}
        </span>
        {description && (
          <FieldHelp label={`Notes for ${name}`}>
            <ReactMarkdown source={description} skipHtml />
          </FieldHelp>
        )}
      </div>
      <div>
        <div className={styles.inputBox}>
          <Editor
            ref={editorRef}
            ariaLabel={name || "Calculator input"}
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
    </div>
  );
});
