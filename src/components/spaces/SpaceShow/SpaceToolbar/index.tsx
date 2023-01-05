import _ from "lodash";
import React, { Component } from "react";

import Icon from "~/components/react-fa-patched";
import Modal from "react-modal";
import ReactTooltip from "react-tooltip";

import { CardListElement } from "~/components/utility/Card";
import { DropDown } from "~/components/utility/DropDown";
import { CanvasViewForm } from "../CanvasViewForm";
import { ViewOptionToggle } from "../ViewOptionToggle";
import { ImportFromSlurpForm } from "./import_from_slurp_form";
import { CanvasActionState } from "~/modules/canvas_state/reducer";

const ProgressMessage: React.FC<{
  actionState: CanvasActionState | undefined;
}> = ({ actionState }) => (
  <div className="saveMessage">
    {actionState == "SAVING" && "Saving..."}
    {actionState == "COPYING" && "Copying..."}
    {actionState == "CREATING" && "Creating a new model..."}
    {actionState == "UNALLOWED_ATTEMPT" && (
      <div className="ui grey horizontal label">
        Notice: Your changes will not save in viewing mode
      </div>
    )}
    {actionState == "ERROR" && (
      <div className="ui red horizontal label">ERROR SAVING</div>
    )}
    {actionState == "ERROR_COPYING" && (
      <div className="ui red horizontal label">ERROR COPYING</div>
    )}
    {actionState == "ERROR_CREATING" && (
      <div className="ui red horizontal label">ERROR CREATING NEW MODEL</div>
    )}
    {actionState == "SAVED" && "All changes saved"}
    {actionState == "COPIED" && "Successfully copied"}
    {actionState == "CREATED" && "New model created"}
    {actionState == "CONFLICT" && (
      <div className="ui red horizontal label">
        {"Model has changed since your last save. Refresh and try again later."}
      </div>
    )}
  </div>
);

type Props = {
  editsAllowed: boolean;
  onAllowEdits: () => void;
  onForbidEdits: () => void;
  isLoggedIn: boolean;
  onDestroy(): void;
  onCopyModel(): void;
  onCopyMetrics(): void;
  onPasteMetrics(): void;
  onDeleteMetrics(): void;
  onCutMetrics(): void;
  isPrivate: boolean | undefined;
  editableByMe: boolean;
  actionState: CanvasActionState | undefined; // TODO - union
  onUndo(): void;
  onRedo(): void;
  canUndo: boolean;
  canRedo: boolean;
  onImportSlurp(slurp: unknown): void;
  calculators: any; // FIXME
  makeNewCalculator(): void;
  showCalculator(c: unknown): void;
  toggleFactSidebar(): void;
  canShowFactSidebar: boolean;
  onOpenTutorial(): void;
};

type State = {
  importModalOpen: boolean;
};

export class SpaceToolbar extends Component<Props, State> {
  state: State = {
    importModalOpen: false,
  };

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

  shouldComponentUpdate(nextProps: Props, nextState: State) {
    return (
      this.props.editableByMe !== nextProps.editableByMe ||
      this.props.actionState !== nextProps.actionState ||
      this.props.editsAllowed !== nextProps.editsAllowed ||
      this.props.canUndo !== nextProps.canUndo ||
      this.props.canRedo !== nextProps.canRedo ||
      this.props.isLoggedIn !== nextProps.isLoggedIn ||
      !_.isEqual(this.props.calculators, nextProps.calculators) ||
      this.state.importModalOpen !== nextState.importModalOpen
    );
  }

  onImportSlurp(slurp) {
    this.setState({ importModalOpen: false });
    this.props.onImportSlurp(slurp);
  }

  render() {
    const {
      editableByMe,
      actionState,
      isLoggedIn,
      onCopyModel,
      onCopyMetrics,
      onPasteMetrics,
      onDeleteMetrics,
      onCutMetrics,
      onDestroy,
      onUndo,
      canUndo,
      onRedo,
      canRedo,
      editsAllowed,
      onAllowEdits,
      onForbidEdits,
      calculators,
      makeNewCalculator,
      toggleFactSidebar,
      onOpenTutorial,
    } = this.props;
    const reactTooltipParams = {
      class: "header-action-tooltip",
      delayShow: 0,
      delayHide: 0,
      place: "bottom",
      effect: "solid",
    };

    let view_mode_header =
      editableByMe && editsAllowed ? (
        <span>
          <Icon name="pencil" /> Editing
        </span>
      ) : (
        <span>
          <Icon name="eye" /> Viewing
        </span>
      );

    const customStyles = {
      overlay: {
        backgroundColor: "rgba(55, 68, 76, 0.4)",
      },
      content: {
        top: "30%",
        left: "30%",
        width: "40%",
        right: "auto",
        bottom: "auto",
        marginRight: "-50%",
        backgroundColor: "#F0F0F0",
        border: "none",
        padding: "1em",
      },
    } as const;

    return (
      <div className="SpaceShowToolbar container-fluid">
        <Modal
          isOpen={this.state.importModalOpen}
          onRequestClose={() => {
            this.setState({ importModalOpen: false });
          }}
          style={customStyles}
        >
          <ImportFromSlurpForm onSubmit={this.onImportSlurp.bind(this)} />
        </Modal>
        <div className="row">
          <div className="col-sm-10">
            <ReactTooltip {...reactTooltipParams} id="cut-button">
              Cut Nodes (ctrl-x)
            </ReactTooltip>
            <ReactTooltip {...reactTooltipParams} id="copy-button">
              Copy Nodes (ctrl-c)
            </ReactTooltip>
            <ReactTooltip {...reactTooltipParams} id="paste-button">
              Paste Nodes (ctrl-v)
            </ReactTooltip>
            <ReactTooltip {...reactTooltipParams} id="delete-button">
              Delete Nodes (del/bksp)
            </ReactTooltip>
            <ReactTooltip {...reactTooltipParams} id="undo-button">
              Undo (ctrl-z)
            </ReactTooltip>
            <ReactTooltip {...reactTooltipParams} id="redo-button">
              Redo (ctrl-shift-z)
            </ReactTooltip>
            <ReactTooltip {...reactTooltipParams} id="calculator">
              Calculators
            </ReactTooltip>
            <ReactTooltip {...reactTooltipParams} id="facts">
              Metric Library
            </ReactTooltip>

            {isLoggedIn && (
              <DropDown
                headerText="Model Actions"
                openLink={<a className="header-action">File</a>}
                position="right"
              >
                <CardListElement
                  icon="copy"
                  header="Copy Model"
                  onMouseDown={onCopyModel}
                />
                {editableByMe && (
                  <CardListElement
                    icon="download"
                    header="Import Slurp"
                    onMouseDown={() => {
                      this.setState({ importModalOpen: true });
                    }}
                    closeOnClick={true}
                  />
                )}
                {editableByMe && (
                  <CardListElement
                    icon="warning"
                    header="Delete Model"
                    onMouseDown={onDestroy}
                  />
                )}
              </DropDown>
            )}

            <CanvasViewForm />

            <a className="header-action" onClick={onOpenTutorial}>
              Tutorial
            </a>

            <div className="header-action-border" />
            <a
              onClick={onCutMetrics}
              className="header-action"
              data-tip
              data-for="cut-button"
            >
              <Icon name="cut" />
            </a>
            <a
              onClick={onCopyMetrics}
              className="header-action"
              data-tip
              data-for="copy-button"
            >
              <Icon name="copy" />
            </a>
            <a
              onClick={onPasteMetrics}
              className="header-action"
              data-tip
              data-for="paste-button"
            >
              <Icon name="paste" />
            </a>
            <a
              onClick={onDeleteMetrics}
              className="header-action"
              data-tip
              data-for="delete-button"
            >
              <Icon name="trash" />
            </a>

            <div className="header-action-border" />
            <a
              onClick={onUndo}
              className={`header-action ${canUndo ? "" : "disabled"}`}
              data-tip
              data-for="undo-button"
            >
              <Icon name="undo" />
            </a>
            <a
              onClick={onRedo}
              className={`header-action ${canRedo ? "" : "disabled"}`}
              data-tip
              data-for="redo-button"
            >
              <Icon name="repeat" />
            </a>

            {(editableByMe || !_.isEmpty(calculators)) && (
              <div>
                <div className="header-action-border" />
                <DropDown
                  headerText="Calculators"
                  openLink={
                    <a className="header-action" data-tip data-for="calculator">
                      <Icon name="calculator" />
                    </a>
                  }
                  position="right"
                >
                  {[
                    ...calculators.map((c) => (
                      <CardListElement
                        key={c.id}
                        header={c.title}
                        onMouseDown={() => {
                          this.props.showCalculator(c);
                        }}
                        closeOnClick={true}
                        icon={"calculator"}
                      />
                    )),
                    editableByMe && (
                      <CardListElement
                        key="new"
                        header="New Calculator"
                        onMouseDown={makeNewCalculator}
                        closeOnClick={true}
                        icon="plus"
                      />
                    ),
                  ]}
                </DropDown>
              </div>
            )}

            {this.props.canShowFactSidebar && (
              <a
                onClick={toggleFactSidebar}
                className="header-action"
                data-tip
                data-for="facts"
              >
                <Icon name="bank" />
              </a>
            )}

            {<ProgressMessage actionState={actionState} />}
          </div>
          <div className="col-sm-2">
            <div className="float-right">
              <ViewOptionToggle
                headerText="Saving Options"
                openLink={
                  <a className="header-action button">{view_mode_header}</a>
                }
                position="left"
                isEditingInvalid={!editableByMe}
                isEditing={editableByMe && editsAllowed}
                onAllowEdits={onAllowEdits}
                onForbidEdits={onForbidEdits}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
