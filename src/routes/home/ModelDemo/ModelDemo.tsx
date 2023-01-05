import _ from "lodash";
import { MarkdownViewer } from "~/components/utility/MarkdownViewer";
import React, { Component } from "react";
import * as TreehouseExample from "./example_treehouse";

const QuestionToggle = ({ name, top, left, onSelect }) => (
  <div
    className={`finder ${name}`}
    onMouseEnter={() => onSelect(name)}
    onMouseLeave={() => onSelect("")}
    style={{
      top: `${top}%`,
      left: `${left}%`,
    }}
  >
    <div className="inner">?</div>
  </div>
);

// unused?
export default class ModelDemo extends Component<{ selection: any }> {
  state = { selection: this.props.selection || "" };

  _onSelect(selection) {
    if (selection !== this.state.selection) {
      this.setState({ selection });
    }
  }

  render() {
    const { selection } = this.state;
    const { image, demoText, toggles } = TreehouseExample;
    let dValue = _.isEmpty(selection) ? demoText.default : demoText[selection];

    return (
      <div className="row ModelDemo">
        <div className="col-sm-4 description">
          <MarkdownViewer source={dValue} />
        </div>
        <div className="col-sm-8">
          <div className="diagram">
            {toggles.map((t) => (
              <QuestionToggle
                name={t[0]}
                top={t[1]}
                left={t[2]}
                onSelect={this._onSelect.bind(this)}
              />
            ))}
            <img src={image} />
          </div>
        </div>
      </div>
    );
  }
}
