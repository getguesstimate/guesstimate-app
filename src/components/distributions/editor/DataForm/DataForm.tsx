import React, { Component } from "react";

import { SmallDataViewer, LargeDataViewer } from "./DataViewer";

type Props = {
  data: number[];
  size: string;
  onOpen(): void;
  onSave(data: number[] | null): void;
};

export class DataForm extends Component<Props> {
  shouldComponentUpdate() {
    // Deep comparing the data would be expensive and the real gain here is just to avoid rerendering the static small component.
    return this.props.size !== "small";
  }

  render() {
    const { size, data, onOpen, onSave } = this.props;
    const isLarge = size === "large";
    return (
      <div>
        {!isLarge && (
          <SmallDataViewer
            onDelete={() => {
              onSave(null);
            }}
            onOpen={onOpen}
          />
        )}
        {isLarge && (
          <div className="row">
            <div className="col-sm-12">
              <LargeDataViewer
                data={data}
                onDelete={() => {
                  onSave(null);
                }}
                onSave={onSave}
              />
            </div>
          </div>
        )}
      </div>
    );
  }
}
