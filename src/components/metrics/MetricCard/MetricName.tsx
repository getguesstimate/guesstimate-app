import React, {
  ChangeEvent,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

import clsx from "clsx";
import _ from "lodash";
import TextareaAutosize from "react-textarea-autosize";
import { typeSafeEq } from "~/lib/engine/utils";

type Props = {
  name: string | undefined;
  inSelectedCell: boolean;
  titleView: boolean;
  isOutput: boolean;
  onChange(text: string): void;
  heightHasChanged(): void;
  anotherFunctionSelected: boolean;
  jumpSection(): void;
  onReturn(): void;
  onTab(): void;
};

export type MetricNameHandle = { focus(): void; hasContent(): boolean };

export const MetricName = forwardRef<MetricNameHandle, Props>(
  function MetricName(props, ref) {
    const [value, setValue] = useState(props.name || "");

    const valueRef = useRef(value);
    useEffect(() => {
      valueRef.current = value;
    }, []);

    const editorRef = useRef<HTMLTextAreaElement | null>(null);

    useEffect(() => {
      // save on unmount
      return () => {
        if (
          valueRef.current !== undefined &&
          valueRef.current !== (props.name || "")
        ) {
          props.onChange(valueRef.current);
        }
      };
    }, []);

    useEffect(() => {
      setValue(props.name || "");
    }, [props.name]);

    const hasContent = () => {
      return !_.isEmpty(value);
    };

    const focus = () => {
      window.setTimeout(() => {
        editorRef.current?.focus();
      }, 1);
    };

    useImperativeHandle(ref, () => ({
      focus,
      hasContent,
    }));

    const handleSubmit = () => {
      if (hasChanged()) {
        props.onChange(value);
      }
    };

    const hasChanged = () => {
      return !typeSafeEq(value, props.name || "");
    };

    const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
      setValue(e.target.value);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
      props.heightHasChanged();

      if (e.code === "Tab") {
        if (e.shiftKey) {
          props.onTab();
        } else {
          props.jumpSection();
        }
        e.stopPropagation();
        e.preventDefault();
      }

      if (e.code === "Enter") {
        if (e.shiftKey) {
          props.onReturn();
        } else {
          props.jumpSection();
        }
        e.stopPropagation();
        e.preventDefault();
      }
    };

    return (
      <TextareaAutosize
        value={value}
        onClick={props.anotherFunctionSelected ? undefined : focus}
        onBlur={handleSubmit}
        onChange={handleChange}
        placeholder="name"
        onKeyDown={handleKeyDown}
        ref={editorRef}
        className={clsx(
          "leading-[1.2em] block w-full resize-none overflow-hidden bg-transparent p-0.5 text-lg outline-none focus:text-dark-3",
          props.anotherFunctionSelected && "cursor-pointer",
          props.titleView
            ? "text-[#3c4f67] font-semibold"
            : [
                "text-[rgb(69,98,134)]/80",
                props.isOutput ? "font-medium" : "font-light",
              ]
        )}
      />
    );
  }
);
