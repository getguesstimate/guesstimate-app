import React, { Component } from "react";

import DropDown from "gComponents/utility/drop-down/index";

export class SpaceName extends Component {
  focusForm() {
    this.refs.name.focus();
  }

  onSave() {
    this.props.onSave(this.refs.name.value);
    this.refs.DropDown._close();
  }

  render() {
    let { editableByMe, name } = this.props;
    const hasName = !_.isEmpty(name);
    const className = `text-editable ${hasName ? "" : "default-value"}`;
    const showName = hasName ? name : "Untitled Model";
    return (
      <span>
        {editableByMe && (
          <DropDown
            headerText={hasName ? "Rename Model" : "Name Model"}
            openLink={<h1 className={className}> {showName} </h1>}
            position="right"
            hasPadding={true}
            width="wide"
            onOpen={this.focusForm.bind(this)}
            ref="DropDown"
          >
            <div className="ui form">
              <textarea defaultValue={name} type="text" rows="2" ref="name" />
              {!hasName && (
                <p>
                  What are you trying to estimate? Be specific, so others can
                  understand. Example: 'The time it will take George to walk
                  home.'
                </p>
              )}
              <div
                className="ui button primary large"
                onClick={this.onSave.bind(this)}
              >
                {hasName ? "Rename Model" : "Name Model"}
              </div>
            </div>
          </DropDown>
        )}
        {!editableByMe && <h1> {name} </h1>}
      </span>
    );
  }
}
