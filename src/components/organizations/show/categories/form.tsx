import React, { Component } from "react";

import { FactCategory, isFactCategoryValid } from "~/lib/engine/fact_category";

type Props = {
  startingCategory: FactCategory;
  onSubmit(category: FactCategory): void;
  onCancel?(): void;
  existingCategoryNames: string[];
};

export class CategoryForm extends Component<Props> {
  // TODO(matthew): We have wiring (via props) for onCancel, but no button. Either strip that code or add cancellation buttons.
  static defaultProps = {
    startingCategory: {
      name: "",
    },
  };

  state = {
    runningCategory: this.props.startingCategory,
  };

  setCategoryState(newCategoryState) {
    this.setState({
      runningCategory: { ...this.state.runningCategory, ...newCategoryState },
    });
  }
  onChangeName(e: React.ChangeEvent<HTMLInputElement>) {
    this.setCategoryState({ name: e.target.value });
  }
  isValid() {
    const {
      props: { existingCategoryNames, startingCategory },
      state: { runningCategory },
    } = this;
    return isFactCategoryValid(
      runningCategory,
      existingCategoryNames.filter((n) => n !== startingCategory.name)
    );
  }
  onSubmit() {
    if (!this.isValid()) {
      return;
    }

    this.props.onSubmit(this.state.runningCategory);
    this.setCategoryState(this.props.startingCategory);
  }

  render() {
    return (
      <div className="row">
        <div className="col-md-10">
          <div className={`field${!this.isValid() ? " error" : ""}`}>
            <h3>
              <input
                name="name"
                placeholder="New Category"
                value={this.state.runningCategory.name}
                onChange={this.onChangeName.bind(this)}
              />
            </h3>
          </div>
        </div>
        <div className="col-md-2">
          <span
            className={`ui button primary tiny${
              !this.isValid() ? " disabled" : ""
            }`}
            onClick={this.onSubmit.bind(this)}
          >
            Save
          </span>
        </div>
      </div>
    );
  }
}
