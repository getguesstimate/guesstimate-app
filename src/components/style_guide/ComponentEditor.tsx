import clsx from "clsx";
import React from "react";
import JSONTree from "react-json-tree";

type Props<T> = {
  childProps: T;
  name: string;
  context?: string;
  backgroundColor?: "white" | "grey";
  child: React.FC<T>;
};

export function ComponentEditor<T>({
  childProps,
  name,
  context,
  backgroundColor = "white",
  child: Child,
}: Props<T>): React.ReactElement {
  return (
    <div
      className={clsx(
        "grid grid-cols-6 gap-8 mt-8", // TODO - move mt-8 to outer layout component
        backgroundColor === "grey" && "bg-[#f7f5f5]"
      )}
    >
      <div>
        <h3>{name}</h3>
        <h4>{context}</h4>
        <JSONTree data={childProps} />
      </div>
      <div className="col-span-5">
        {
          <Child
            {
              ...(childProps as T &
                JSX.IntrinsicAttributes) /* weird lie, should investigate */
            }
          />
        }
      </div>
    </div>
  );
}