import React, { Component } from "react";
import PropTypes from "prop-types";

import { connect } from "react-redux";

import $ from "jquery";
import {
  EditorState,
  Editor,
  ContentState,
  Modifier,
  CompositeDecorator,
} from "draft-js";

import { clearSuggestion, getSuggestion } from "gModules/facts/actions";

import {
  HANDLE_REGEX,
  GLOBALS_ONLY_REGEX,
  resolveToSelector,
} from "gEngine/facts";
import { or, getClassName } from "gEngine/utils";

import { isData, formatData } from "lib/guesstimator/formatter/formatters/Data";

function findWithRegex(baseRegex, contentBlock, callback) {
  const text = contentBlock.getText();
  const regex = new RegExp(baseRegex.source, "g");
  let matchArr, start;
  while ((matchArr = regex.exec(text)) !== null) {
    start = matchArr.index;
    callback(start, start + matchArr[0].length);
  }
}

const FLASH_DURATION_MS = 400; // Adjust flash duration here. Should match variable in ../../style.css as well.

//TODO: The passing in of all props in the span causes React to complain. See this issue:
//https://github.com/facebook/draft-js/issues/675
const stylizedSpan = (className) => (props) =>
  (
    <span {...props} className={className}>
      {props.children}
    </span>
  );
const Fact = stylizedSpan("fact input");
const Suggestion = stylizedSpan("suggestion");
const ValidInput = stylizedSpan("valid input");
const ErrorInput = stylizedSpan("error input");

const positionDecorator = (start, end, component) => ({
  strategy: (contentBlock, callback) => {
    if (end <= contentBlock.text.length) {
      callback(start, end);
    }
  },
  component,
});

@connect(
  (state) => ({ suggestion: state.facts.currentSuggestion }),
  null,
  null,
  { withRef: true }
)
export class TextInput extends Component {
  displayName: "Guesstimate-TextInput";

  state = {
    editorState: EditorState.createWithContent(
      ContentState.createFromText(this.props.value || ""),
      new CompositeDecorator(this.decoratorList())
    ),
    isFlashing: false,
  };

  static propTypes = {
    value: PropTypes.string,
  };

  factRegex() {
    const baseRegex = this.props.canUseOrganizationFacts
      ? HANDLE_REGEX
      : GLOBALS_ONLY_REGEX;
    return new RegExp(baseRegex, "g"); // We always want a fresh, global regex.
  }

  decoratorList(extraDecorators = []) {
    const { validInputs, errorInputs } = this.props;

    const fact_regex = this.factRegex();
    const fact_decorators = [
      {
        strategy: (contentBlock, callback) => {
          findWithRegex(fact_regex, contentBlock, callback);
        },
        component: Fact,
      },
    ];

    let decorators = [...extraDecorators, ...fact_decorators];

    if (!_.isEmpty(validInputs)) {
      const validInputsRegex = or(validInputs);
      decorators.push({
        strategy: (contentBlock, callback) => {
          findWithRegex(validInputsRegex, contentBlock, callback);
        },
        component: ValidInput,
      });
    }
    if (!_.isEmpty(errorInputs)) {
      const errorInputsRegex = or(errorInputs);
      decorators.push({
        strategy: (contentBlock, callback) => {
          findWithRegex(errorInputsRegex, contentBlock, callback);
        },
        component: ErrorInput,
      });
    }
    return decorators;
  }

  focus() {
    this.refs.editor.focus();
  }

  addText(text, maintainCursorPosition = true, replaceLength = 0) {
    const selection = this.state.editorState.getSelection();
    const content = this.state.editorState.getCurrentContent();

    let baseEditorState;
    if (replaceLength > 0) {
      const replaceSelection = selection.merge({
        anchorOffset: this.cursorPosition(),
        focusOffset: this.cursorPosition() + replaceLength,
      });
      baseEditorState = EditorState.push(
        this.state.editorState,
        Modifier.replaceText(content, replaceSelection, text),
        "paste"
      );
    } else {
      baseEditorState = EditorState.push(
        this.state.editorState,
        Modifier.insertText(content, selection, text),
        "paste"
      );
    }

    if (!maintainCursorPosition) {
      return baseEditorState;
    }

    const cursorPosition = selection.getFocusOffset();
    const newSelectionState = selection.merge({ focusOffset: cursorPosition });
    return EditorState.forceSelection(baseEditorState, newSelectionState);
  }

  stripExtraDecorators(editorState) {
    return this.withExtraDecorators(editorState, []);
  }
  withExtraDecorators(editorState, extraDecorators) {
    return EditorState.set(editorState, {
      decorator: new CompositeDecorator(this.decoratorList(extraDecorators)),
    });
  }
  updateDecorators() {
    this.setState({
      editorState: this.withExtraDecorators(this.state.editorState, []),
    });
  }

  deleteOldSuggestion(oldSuggestion) {
    const freshEditorState = this.addText("", true, oldSuggestion.length);
    this.setState({ editorState: this.stripExtraDecorators(freshEditorState) });

    const text = this.text(freshEditorState);
    if (text !== this.props.value) {
      this.props.onChange(text);
    }
  }

  addSuggestion() {
    const partial = resolveToSelector(this.props.organizationId)(
      this.prevWord()
    ).pop();

    const extraDecorators = [
      positionDecorator(
        this.cursorPosition() - this.prevWord().length,
        this.cursorPosition(),
        Fact
      ),
      positionDecorator(
        this.cursorPosition(),
        this.cursorPosition() + this.props.suggestion.length,
        Suggestion
      ),
    ];

    const addedEditorState = this.addText(
      this.props.suggestion,
      true,
      this.nextWord().length
    );

    this.setState({
      editorState: this.withExtraDecorators(addedEditorState, extraDecorators),
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.suggestion !== prevProps.suggestion &&
      this.nextWord() === prevProps.suggestion
    ) {
      if (_.isEmpty(this.props.suggestion)) {
        this.deleteOldSuggestion(prevProps.suggestion);
      } else {
        this.addSuggestion();
      }
    } else if (
      !_.isEqual(prevProps.validInputs, this.props.validInputs) ||
      !_.isEqual(prevProps.errorInputs, this.props.errorInputs) ||
      !_.isEqual(prevState.isFlashing, this.state.isFlashing)
    ) {
      setTimeout(() => {
        this.updateDecorators();
      }, 1);
    }
  }

  componentWillUnmount() {
    const selection = this.state.editorState.getSelection();
    if (selection && selection.getHasFocus()) {
      this.handleBlur();
    }
  }

  cursorPosition(editorState = this.state.editorState) {
    return editorState.getSelection().getFocusOffset();
  }
  text(editorState = this.state.editorState) {
    return editorState.getCurrentContent().getPlainText("");
  }
  nextWord(editorState = this.state.editorState) {
    return this.text(editorState)
      .slice(this.cursorPosition(editorState))
      .split(/[^\w]/)[0];
  }
  prevWord(editorState = this.state.editorState) {
    return this.text(editorState)
      .slice(0, this.cursorPosition(editorState))
      .split(/[^\w@#\.]/)
      .pop();
  }

  fetchSuggestion(editorState) {
    const prevWord = this.prevWord(editorState);
    if (
      editorState.getSelection().isCollapsed() &&
      this.factRegex().test(prevWord)
    ) {
      this.props.dispatch(
        getSuggestion(resolveToSelector(this.props.organizationId)(prevWord))
      );
    } else {
      if (!_.isEmpty(this.props.suggestion)) {
        this.props.dispatch(clearSuggestion());
      }
    }
  }

  changeData(text) {
    this.props.onChangeData(formatData(text));
  }

  handlePastedText(text) {
    if (text === this.props.value || !isData(text)) {
      return false;
    }

    this.changeData(text);
    return true;
  }

  onChange(editorState) {
    this.fetchSuggestion(editorState);
    this.setState({ editorState });

    const text = this.text(editorState);
    if (text !== this.props.value) {
      isData(text) ? this.changeData(text) : this.props.onChange(text);
    }
  }

  acceptSuggestionIfAppropriate() {
    if (
      !_.isEmpty(this.props.suggestion) &&
      this.nextWord() === this.props.suggestion
    ) {
      this.acceptSuggestion();
      return true;
    }
    return false;
  }

  handleTab(e) {
    if (!this.acceptSuggestionIfAppropriate()) {
      this.props.onTab(e.shiftKey);
    }
    e.preventDefault();
  }

  acceptSuggestion() {
    const suffix =
      this.prevWord().startsWith("@") && !this.prevWord().includes(".")
        ? "."
        : "";
    const cursorPosition = this.cursorPosition();
    const addedEditorState = this.addText(
      `${this.props.suggestion}${suffix}`,
      false,
      this.props.suggestion.length
    );
    this.onChange(this.stripExtraDecorators(addedEditorState));
  }

  flash() {
    this.setState({ isFlashing: true });
    setTimeout(() => {
      this.setState({ isFlashing: false });
    }, FLASH_DURATION_MS);
  }

  functionMetricClicked(readableId) {
    this.onChange(this.addText(readableId, false));
    this.flash();
  }

  handleFocus() {
    $(window).on("functionMetricClicked", (_, { readableId }) => {
      this.functionMetricClicked(readableId);
    });
    this.props.onFocus();
  }

  handleBlur() {
    $(window).off("functionMetricClicked");
    this.props.onBlur();
  }

  handleReturn(e) {
    if (!this.acceptSuggestionIfAppropriate()) {
      this.props.onReturn(e.shiftKey);
    }
    return "handled";
  }

  render() {
    const {
      props: { hasErrors, width, value, validInputs },
      state: { isFlashing, editorState },
    } = this;
    const className = getClassName(
      "TextInput",
      width,
      isFlashing ? "flashing" : null,
      hasErrors ? "hasErrors" : null
    );
    return (
      <span
        className={className}
        onClick={this.focus.bind(this)}
        onKeyDown={(e) => {
          e.stopPropagation();
        }}
      >
        <Editor
          onFocus={this.handleFocus.bind(this)}
          editorState={editorState}
          handleReturn={this.handleReturn.bind(this)}
          handlePastedText={this.handlePastedText.bind(this)}
          onTab={this.handleTab.bind(this)}
          onBlur={this.handleBlur.bind(this)}
          onChange={this.onChange.bind(this)}
          ref="editor"
          placeholder={"value"}
        />
      </span>
    );
  }
}
