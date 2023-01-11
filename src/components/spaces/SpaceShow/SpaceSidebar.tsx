import React, { Component } from "react";

import { ClickToEdit } from "~/components/utility/ClickToEdit";
import { MarkdownViewer } from "~/components/utility/MarkdownViewer";
import { ButtonCloseText } from "~/components/utility/buttons/close";

type Props = {
  description: string;
  canEdit: boolean;
  onClose(): void;
  onSaveDescription(s: string): void;
};

export class SpaceSidebar extends Component<Props> {
  componentDidMount() {
    window.recorder.recordMountEvent(this);
  }
  componentWillUpdate() {
    window.recorder.recordRenderStartEvent(this);
  }
  componentDidUpdate() {
    window.recorder.recordRenderStopEvent(this);
  }
  componentWillUnmount() {
    window.recorder.recordUnmountEvent(this);
  }

  shouldComponentUpdate(nextProps: Props) {
    return (
      nextProps.canEdit !== this.props.canEdit ||
      this.props.description !== nextProps.description
    );
  }

  render() {
    const { description, canEdit, onClose, onSaveDescription } = this.props;
    return (
      <div className="SpaceSidebar">
        <div className="SpaceSidebar-inside">
          <div className="SpaceSidebar-header">
            <div className="closeSidebar">
              <ButtonCloseText onClick={onClose} />
            </div>
          </div>
          <div className="SpaceSidebar-body">
            <ClickToEdit
              viewing={<MarkdownViewer source={description} />}
              emptyValue={
                <span className="emptyValue">Describe this model...</span>
              }
              editingSaveText="Save"
              onSubmit={onSaveDescription}
              canEdit={canEdit}
              value={description}
            />
          </div>
        </div>
      </div>
    );
  }
}
