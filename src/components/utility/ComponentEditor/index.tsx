import React from "react";
import JSONTree from "react-json-tree";

type Props<T> = {
  childProps: T;
  name: string;
  context?: string;
  backgroundColor?: string;
  child: React.FC<T>;
};

export default function ComponentEditor<T>({
  childProps,
  name,
  context,
  backgroundColor = "white",
  child: Child,
}: Props<T>): React.ReactElement {
  const className = `row ComponentEditor ${backgroundColor}`;
  return (
    <div className={className}>
      <div className="col-sm-2 reference">
        <h3>{name}</h3>
        <h4>{context}</h4>
        <JSONTree data={childProps} />
      </div>
      <div className="col-sm-10 Component">
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