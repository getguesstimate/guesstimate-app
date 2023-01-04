import React, { Component } from "react";

import ClickToEdit from "~/components/utility/click-to-edit/index";
import { MarkdownViewer } from "~/components/utility/markdown-viewer/index";
import { ButtonCloseText } from "~/components/utility/buttons/close";

export class SpaceSidebar extends Component<any> {
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

  shouldComponentUpdate(nextProps) {
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
            <div className={"closeSidebar"}>
              {<ButtonCloseText onClick={onClose} />}
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
