import clsx from "clsx";
import React from "react";

type ExtraProps = {
  error?: boolean;
};

function buildProps<T extends ExtraProps & { className?: string }>(props: T) {
  const { className, error, ...rest } = props;
  return {
    className: clsx(
      "py-1 px-2 border rounded-sm outline-none transition-colors",
      error
        ? "bg-red-2 border-red-1"
        : "bg-white border-grey-ccc focus:border-blue-1",
      className
    ),
    ...rest,
  };
}

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & ExtraProps
>(function Input(props, ref) {
  return <input ref={ref} {...buildProps(props)} />;
});

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement> & ExtraProps
>(function Textarea(props, ref) {
  return <textarea ref={ref} {...buildProps(props)} />;
});

export const Select = React.forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement> & ExtraProps
>(function Select(props, ref) {
  return <select ref={ref} {...buildProps(props)} />;
});
