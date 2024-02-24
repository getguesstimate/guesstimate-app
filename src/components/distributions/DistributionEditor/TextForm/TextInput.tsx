import React, { Component, FC, PropsWithChildren } from "react";

import clsx from "clsx";
import {
  CompositeDecorator,
  ContentBlock,
  ContentState,
  DraftDecorator,
  DraftHandleValue,
  Editor,
  EditorState,
  getDefaultKeyBinding,
  Modifier,
} from "draft-js";
import _ from "lodash";
import { connect } from "react-redux";
import {
  GLOBALS_ONLY_REGEX,
  HANDLE_REGEX,
  resolveToSelector,
} from "~/lib/engine/facts";
import { or } from "~/lib/engine/utils";
import {
  formatData,
  isData,
} from "~/lib/guesstimator/formatter/formatters/Data";
import { clearSuggestion, getSuggestion } from "~/modules/facts/actions";
import { AppDispatch, RootState } from "~/modules/store";

function findWithRegex(
  baseRegex: RegExp,
  contentBlock: ContentBlock,
  callback: (start: number, end: number) => void
) {
  const text = contentBlock.getText();
  const regex = new RegExp(baseRegex.source, "g");
  let matchArr: ReturnType<typeof regex.exec>, start: number | undefined;
  while ((matchArr = regex.exec(text)) !== null) {
    start = matchArr.index;
    callback(start, start + matchArr[0].length);
  }
}

const FLASH_DURATION_MS = 400; // Adjust flash duration here. Should match variable in ../../style.css as well.

const stylizedSpan =
  (className: string): FC<PropsWithChildren> =>
  (props) => {
    const propsCopy = { ...props };
    // The passing in of all props in the span causes React to complain. See this issue:
    // https://github.com/facebook/draft-js/issues/675
    for (const key of [
      "contentState",
      "blockKey",
      "entityKey",
      "offsetKey",
      "decoratedText",
    ]) {
      delete propsCopy[key];
    }
    return (
      <span {...propsCopy} className={className}>
        {props.children}
      </span>
    );
  };

const inputClassName = "font-medium rounded-xs px-0.5 mx-0.5 inline-block";
const factClassName = "text-[#483567] bg-[#e5dbf7]";
const validClassName = "text-green-3 bg-green-4";
const errorClassName = "text-[#560606] bg-[#ff9e9e]";

const Fact = stylizedSpan(clsx(inputClassName, factClassName));
const ValidInput = stylizedSpan(clsx(inputClassName, validClassName));
const ErrorInput = stylizedSpan(clsx(inputClassName, errorClassName));
const Suggestion = stylizedSpan("bg-[#b5ddff]");

const positionDecorator = (
  start: number,
  end: number,
  component: FC
): DraftDecorator => ({
  strategy: (contentBlock: any, callback) => {
    if (end <= contentBlock.text.length) {
      callback(start, end);
    }
  },
  component,
});

type Props = {
  value: string;
  validInputs: string[];
  errorInputs: string[];
  onChangeData(data: number[]): void;
  onChange(text: string): void;
  onTab(shifted: boolean): void;
  onReturn(shifted: boolean): void;
  onBlur(): void;
  onFocus(): void;
  canUseOrganizationFacts: boolean;
  organizationId?: string | number;
  size?: "small" | "large";
} & { dispatch: AppDispatch } & { suggestion: string };

type State = {
  editorState: EditorState;
  isFlashing: boolean;
};

export class UnconnectedTextInput extends Component<Props, State> {
  editorRef: React.RefObject<Editor>;
  clickHandler: (e: CustomEvent) => void;

  state: State = {
    editorState: EditorState.createWithContent(
      ContentState.createFromText(this.props.value || ""),
      new CompositeDecorator(this.decoratorList())
    ),
    isFlashing: false,
  };

  constructor(props: Props) {
    super(props);
    this.editorRef = React.createRef();
    this.clickHandler = (e: CustomEvent) => {
      this.functionMetricClicked(e.detail.readableId);
    };
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
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

  // componentDidCatch() {
  //   // hack from https://github.com/facebookarchive/draft-js/issues/1320
  //   this.forceUpdate();
  // }

  factRegex() {
    const baseRegex = this.props.canUseOrganizationFacts
      ? HANDLE_REGEX
      : GLOBALS_ONLY_REGEX;
    return new RegExp(baseRegex, "g"); // We always want a fresh, global regex.
  }

  decoratorList(extraDecorators: DraftDecorator[] = []) {
    const { validInputs, errorInputs } = this.props;

    const fact_regex = this.factRegex();
    const factDecorators: DraftDecorator[] = [
      {
        strategy: (contentBlock, callback) => {
          findWithRegex(fact_regex, contentBlock, callback);
        },
        component: Fact,
      },
    ];

    let decorators: DraftDecorator[] = [...extraDecorators, ...factDecorators];

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
    this.editorRef.current?.focus();
  }

  addText(text: string, maintainCursorPosition = true, replaceLength = 0) {
    const selection = this.state.editorState.getSelection();
    const content = this.state.editorState.getCurrentContent();

    let baseEditorState: EditorState;
    if (replaceLength > 0) {
      const replaceSelection = selection.merge({
        anchorOffset: this.cursorPosition(),
        focusOffset: this.cursorPosition() + replaceLength,
      });
      baseEditorState = EditorState.push(
        this.state.editorState,
        Modifier.replaceText(content, replaceSelection, text),
        "insert-characters" // TODO - is this correct?
      );
    } else {
      baseEditorState = EditorState.push(
        this.state.editorState,
        Modifier.insertText(content, selection, text),
        "insert-characters" // TODO - is this correct?
      );
    }

    if (!maintainCursorPosition) {
      return baseEditorState;
    }

    const cursorPosition = selection.getFocusOffset();
    const newSelectionState = selection.merge({ focusOffset: cursorPosition });
    return EditorState.forceSelection(baseEditorState, newSelectionState);
  }

  stripExtraDecorators(editorState: EditorState) {
    return this.withExtraDecorators(editorState, []);
  }

  withExtraDecorators(
    editorState: EditorState,
    extraDecorators: DraftDecorator[]
  ) {
    return EditorState.set(editorState, {
      decorator: new CompositeDecorator(this.decoratorList(extraDecorators)),
    });
  }

  updateDecorators() {
    this.setState({
      editorState: this.withExtraDecorators(this.state.editorState, []),
    });
  }

  deleteOldSuggestion(oldSuggestion: string) {
    const freshEditorState = this.addText("", true, oldSuggestion.length);
    this.setState({ editorState: this.stripExtraDecorators(freshEditorState) });

    const text = this.text(freshEditorState);
    if (text !== this.props.value) {
      this.props.onChange(text);
    }
  }

  addSuggestion() {
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
      .pop() as string; // split always returns a non-empty array
  }

  fetchSuggestion(editorState: EditorState) {
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

  changeData(text: string) {
    this.props.onChangeData(formatData(text));
  }

  handleChange(editorState: EditorState) {
    this.fetchSuggestion(editorState);
    this.setState({ editorState });

    const text = this.text(editorState);
    if (text !== this.props.value) {
      setTimeout(() => {
        if (isData(text)) {
          this.changeData(text);
        } else {
          this.props.onChange(text);
        }
      }, 0);
    }
  }

  flash() {
    this.setState({ isFlashing: true });
    setTimeout(() => {
      this.setState({ isFlashing: false });
    }, FLASH_DURATION_MS);
  }

  functionMetricClicked(readableId: string) {
    this.handleChange(this.addText(readableId, false));
    this.flash();
  }

  handleBlur() {
    window.removeEventListener("functionMetricClicked", this.clickHandler);
    this.props.onBlur();
  }

  render() {
    const { isFlashing, editorState } = this.state;

    const acceptSuggestionIfAppropriate = () => {
      if (
        !_.isEmpty(this.props.suggestion) &&
        this.nextWord() === this.props.suggestion
      ) {
        acceptSuggestion();
        return true;
      }
      return false;
    };

    const acceptSuggestion = () => {
      const suffix =
        this.prevWord().startsWith("@") && !this.prevWord().includes(".")
          ? "."
          : "";
      const addedEditorState = this.addText(
        `${this.props.suggestion}${suffix}`,
        false,
        this.props.suggestion.length
      );
      this.handleChange(this.stripExtraDecorators(addedEditorState));
    };

    const handleReturn = (e: React.KeyboardEvent): DraftHandleValue => {
      if (!acceptSuggestionIfAppropriate()) {
        this.props.onReturn(e.shiftKey);
      }
      return "handled";
    };

    const keyBindingFn = (e: React.KeyboardEvent): string | null => {
      if (e.key === "Tab") {
        return e.shiftKey ? "guesstimate-shifted-tab" : "guesstimate-tab";
      }
      return getDefaultKeyBinding(e);
    };

    const handleKeyCommand = (command: string): DraftHandleValue => {
      if (
        command === "guesstimate-tab" ||
        command === "guesstimate-shifted-tab"
      ) {
        if (!acceptSuggestionIfAppropriate()) {
          this.props.onTab(command === "guesstimate-shifted-tab");
        }
        return "handled";
      }

      return "not-handled";
    };

    const handleFocus = () => {
      window.addEventListener("functionMetricClicked", this.clickHandler);
      this.props.onFocus();
    };

    const handlePastedText = (text: string): DraftHandleValue => {
      if (text === this.props.value || !isData(text)) {
        return "not-handled";
      }

      this.changeData(text);
      return "handled";
    };

    return (
      <div
        className={clsx(
          "rounded-sm border-2",
          "break-words leading-tight",
          "transition-colors duration-300",
          this.props.size === "small" && [
            "font-light",
            "focus:text-black-3 text-[#456286]/80",
          ],
          this.props.size === "large" && [
            "text-2xl font-thin",
            "bg-grey-eee text-grey-666",
            "p-1",
          ],
          isFlashing
            ? "border-[#0fb963] bg-[#c9e8c0]"
            : "border-transparent bg-white"
        )}
        onClick={this.focus.bind(this)}
        onKeyDown={(e) => {
          e.stopPropagation();
        }}
      >
        <Editor
          onFocus={handleFocus}
          editorState={editorState}
          handleReturn={handleReturn}
          handlePastedText={handlePastedText}
          keyBindingFn={keyBindingFn}
          handleKeyCommand={handleKeyCommand}
          onBlur={this.handleBlur.bind(this)}
          onChange={this.handleChange.bind(this)}
          ref={this.editorRef}
          placeholder="value"
        />
      </div>
    );
  }
}

export const TextInput = connect(
  (state: RootState) => ({ suggestion: state.facts.currentSuggestion }),
  null,
  null,
  { forwardRef: true }
)(UnconnectedTextInput);
