import React, { Component } from "react";

import Icon from "gComponents/react-fa-patched";

import { ButtonClose } from "gComponents/utility/buttons/close";

export const SmallDataViewer = ({ onDelete, onOpen }) => (
  <div className="DataViewer DataViewer--card">
    <a className="ui button primary small" onClick={onOpen}>
      {" "}
      <Icon name="bar-chart" /> Custom{" "}
    </a>
    <ButtonClose onClick={onDelete} />
  </div>
);

const Header = ({ mode, onDelete, onEdit }) => (
  <div className="row">
    <div className="col-sm-6">
      <h2>
        {" "}
        <Icon name="bar-chart" /> Custom Data{" "}
      </h2>
    </div>
    {mode === "VIEW" && (
      <div className="col-sm-6">
        <a onClick={onDelete} className="delete">
          {" "}
          <Icon name="close" /> Delete{" "}
        </a>
        <a onClick={onEdit} className="edit">
          {" "}
          <Icon name="pencil" /> Edit{" "}
        </a>
      </div>
    )}
  </div>
);

class Editor extends Component {
  state = {
    value: this.props.data.join("\n"),
    valid: true,
  };

  handleChange(event) {
    const value = event.target.value;
    this.setState({
      value,
      valid: this._isValid(value),
    });
  }

  _isValid(value) {
    const numbers = this._convertToNumbers(value);
    const allValid = _.every(numbers, (e) => _.isFinite(e));
    return allValid;
  }

  _handleSave() {
    const numbers = this._convertToNumbers(this.state.value)
      .filter((e) => _.isFinite(e))
      .slice(0, 10000);
    this.props.onSave(numbers);
  }

  _convertToNumbers(values) {
    return values
      .split(/[\s,]+/)
      .filter((s) => s !== "")
      .map(Number);
  }

  render() {
    return (
      <div>
        <div className="ui form">
          <div className="field">
            <textarea
              value={this.state.value}
              onChange={this.handleChange.bind(this)}
            />
          </div>
        </div>
        <div
          className="ui button primary tiny"
          onClick={this._handleSave.bind(this)}
        >
          {" "}
          Save{" "}
        </div>
        <div className="ui button tiny" onClick={this.props.onEditCancel}>
          {" "}
          Cancel{" "}
        </div>
      </div>
    );
  }
}

const Viewer = ({ data }) => (
  <ul>
    {_.map(data, (element, index) => {
      return (
        <li key={index}>
          <div className="DataPoint" key={index}>
            {element}
          </div>
        </li>
      );
    })}
  </ul>
);

export class LargeDataViewer extends Component {
  state = { mode: "VIEW" };

  beginEditing() {
    this.setState({ mode: "EDIT" });
  }

  onSave(data) {
    this.props.onSave(data);
    this.setState({ mode: "VIEW" });
  }

  render() {
    let bodyClass = "ui segment DataViewer--body";
    const viewMode = this.state.mode === "VIEW";

    bodyClass += viewMode ? " view" : " edit";
    return (
      <div className="DataViewer ui segments">
        <div className="ui segment DataViewer--header">
          <Header
            onDelete={this.props.onDelete}
            onEdit={() => {
              this.setState({ mode: "EDIT" });
            }}
            mode={this.state.mode}
          />
        </div>
        <div className={bodyClass}>
          {this.state.mode === "VIEW" && <Viewer data={this.props.data} />}
          {this.state.mode === "EDIT" && (
            <Editor
              data={this.props.data}
              onEditCancel={() => {
                this.setState({ mode: "VIEW" });
              }}
              onSave={this.onSave.bind(this)}
            />
          )}
        </div>
      </div>
    );
  }
}
