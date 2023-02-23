import clsx from "clsx";
import React from "react";

type ExtraProps = {
  error?: boolean;
  theme?: "normal" | "large" | "padded";
};

function buildProps<T extends ExtraProps & { className?: string }>(props: T) {
  const { className, error, theme = "normal", ...rest } = props;
  return {
    className: clsx(
      "border outline-none transition-colors",
      theme === "normal" && "py-1 px-2 rounded-sm",
      theme === "large" && "p-4 rounded text-lg",
      theme === "padded" && "px-4 py-2 rounded",
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
