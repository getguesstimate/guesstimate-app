import React, { useState } from "react";

import Modal from "react-modal";
import Icon from "~/components/react-fa-patched";

import { CardListElement } from "~/components/utility/Card";
import { DropDown } from "~/components/utility/DropDown";
import { CanvasActionState } from "~/modules/canvas_state/reducer";
import { CanvasViewForm } from "./CanvasViewForm";
import { ViewOptionToggle } from "./ViewOptionToggle";
import { ImportFromSlurpForm } from "./import_from_slurp_form";
import { ToolbarIcon } from "./ToolbarIcon";
import { ToolbarTextItem } from "./ToolbarTextItem";
import clsx from "clsx";

const MessageBox: React.FC<{ color: "GREY" | "RED"; children: string }> = ({
  color,
  children,
}) => (
  <div
    className={clsx(
      "text-white px-2 rounded",
      color === "GREY" ? "bg-grey-666" : "bg-red-5"
    )}
  >
    {children}
  </div>
);

const ProgressMessage: React.FC<{
  actionState: CanvasActionState | undefined;
}> = ({ actionState }) => (
  <div className="text-[#09273a] text-lg">
    {actionState === "SAVING" && "Saving..."}
    {actionState === "COPYING" && "Copying..."}
    {actionState === "CREATING" && "Creating a new model..."}
    {actionState === "UNALLOWED_ATTEMPT" && (
      <MessageBox color="GREY">
        Notice: Your changes will not save in viewing mode
      </MessageBox>
    )}
    {actionState === "ERROR" && (
      <MessageBox color="RED">ERROR SAVING</MessageBox>
    )}
    {actionState === "ERROR_COPYING" && (
      <MessageBox color="RED">ERROR COPYING</MessageBox>
    )}
    {actionState === "ERROR_CREATING" && (
      <MessageBox color="RED">ERROR CREATING NEW MODEL</MessageBox>
    )}
    {actionState === "SAVED" && "All changes saved"}
    {actionState === "COPIED" && "Successfully copied"}
    {actionState === "CREATED" && "New model created"}
    {actionState === "CONFLICT" && (
      <MessageBox color="RED">
        Model has changed since your last save. Refresh and try again later.
      </MessageBox>
    )}
  </div>
);

const Divider: React.FC = () => (
  <div className="w-0.5 bg-[rgb(115,168,190)] h-9 mx-1" />
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

export const SpaceToolbar = React.memo<Props>(function SpaceToolbar({
  editableByMe,
  actionState,
  isLoggedIn,
  onImportSlurp,
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
  showCalculator,
  canShowFactSidebar,
  toggleFactSidebar,
  onOpenTutorial,
}) {
  const [importModalOpen, setImportModalOpen] = useState(false);

  const handleImportSlurp = (slurp) => {
    setImportModalOpen(false);
    onImportSlurp(slurp);
  };

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
    <div className="bg-[rgb(219,221,222)]/70 border-b border-[rgb(37,128,167)]/40 px-8 hidden md:block">
      <Modal
        isOpen={importModalOpen}
        onRequestClose={() => {
          setImportModalOpen(false);
        }}
        style={customStyles}
      >
        <ImportFromSlurpForm onSubmit={handleImportSlurp} />
      </Modal>
      <div className="flex justify-between items-center py-1">
        <div className="flex items-center gap-2">
          {isLoggedIn && (
            <DropDown
              headerText="Model Actions"
              openLink={<ToolbarTextItem text="File" />}
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
                    setImportModalOpen(true);
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

          <ToolbarTextItem onClick={onOpenTutorial} text="Tutorial" />

          <Divider />
          <ToolbarIcon
            tooltipId="cut-button"
            tooltip="Cut Nodes (ctrl-x)"
            onClick={onCutMetrics}
            iconName="cut"
          />
          <ToolbarIcon
            tooltipId="copy-button"
            tooltip="Copy Nodes (ctrl-c)"
            onClick={onCopyMetrics}
            iconName="copy"
          />
          <ToolbarIcon
            tooltipId="paste-button"
            tooltip="Paste Nodes (ctrl-v)"
            onClick={onPasteMetrics}
            iconName="paste"
          />
          <ToolbarIcon
            tooltipId="delete-button"
            tooltip="Delete Nodes (del/bksp)"
            onClick={onDeleteMetrics}
            iconName="trash"
          />

          <Divider />
          <ToolbarIcon
            tooltipId="undo-button"
            tooltip="Undo (ctrl-z)"
            onClick={onUndo}
            iconName="undo"
            disabled={!canUndo}
          />
          <ToolbarIcon
            tooltipId="redo-button"
            tooltip="Redo (ctrl-shift-z)"
            onClick={onRedo}
            iconName="repeat"
            disabled={!canRedo}
          />

          {editableByMe || calculators.length ? (
            <>
              <Divider />
              <DropDown
                headerText="Calculators"
                openLink={
                  <ToolbarIcon
                    tooltipId="calculator"
                    tooltip="Calculators"
                    iconName="calculator"
                  />
                }
                position="right"
              >
                {[
                  ...calculators.map((c) => (
                    <CardListElement
                      key={c.id}
                      header={c.title}
                      onMouseDown={() => {
                        showCalculator(c);
                      }}
                      closeOnClick={true}
                      icon="calculator"
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
            </>
          ) : null}

          {canShowFactSidebar && (
            <ToolbarIcon
              tooltipId="facts"
              tooltip="Metric Library"
              onClick={toggleFactSidebar}
              iconName="bank"
            />
          )}

          <div className="pl-6">
            <ProgressMessage actionState={actionState} />
          </div>
        </div>
        <ViewOptionToggle
          isEditingInvalid={!editableByMe}
          isEditing={editableByMe && editsAllowed}
          onAllowEdits={onAllowEdits}
          onForbidEdits={onForbidEdits}
        />
      </div>
    </div>
  );
});
