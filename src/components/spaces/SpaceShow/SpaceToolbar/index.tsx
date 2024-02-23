import React, { useState } from "react";

import clsx from "clsx";
import _ from "lodash";
import { useRouter } from "next/router";
import Modal from "react-modal";
import { CardListElement } from "~/components/utility/Card";
import { DropDown } from "~/components/utility/DropDown";
import * as e from "~/lib/engine/engine";
import { canUseOrganizationFacts } from "~/lib/engine/space";
import { parseSlurp } from "~/lib/slurpParser";
import { Calculator } from "~/modules/calculators/reducer";
import { allowEdits, forbidEdits } from "~/modules/canvas_state/actions";
import { CanvasActionState } from "~/modules/canvas_state/reducer";
import { redo, undo } from "~/modules/checkpoints/actions";
import * as copiedActions from "~/modules/copied/actions";
import { useAppDispatch, useAppSelector } from "~/modules/hooks";
import { removeSelectedMetrics } from "~/modules/metrics/actions";
import * as simulationActions from "~/modules/simulations/actions";
import * as spaceActions from "~/modules/spaces/actions";
import * as userActions from "~/modules/users/actions";

import { ExtendedDSpace } from "../../denormalized-space-selector";
import { Tutorial } from "../Tutorial";
import { CanvasViewForm } from "./CanvasViewForm";
import { ImportFromSlurpForm } from "./import_from_slurp_form";
import { ToolbarIcon } from "./ToolbarIcon";
import { ToolbarTextItem } from "./ToolbarTextItem";
import { ViewOptionToggle } from "./ViewOptionToggle";

const MessageBox: React.FC<{ color: "GREY" | "RED"; children: string }> = ({
  color,
  children,
}) => (
  <div
    className={clsx(
      "rounded px-2 text-white",
      color === "GREY" ? "bg-grey-666" : "bg-red-5"
    )}
  >
    {children}
  </div>
);

const ProgressMessage: React.FC<{
  actionState: CanvasActionState | undefined;
}> = ({ actionState }) => (
  <div className="text-lg text-[#09273a]">
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
  <div className="mx-1 h-9 w-0.5 bg-[rgb(115,168,190)]" />
);

type Props = {
  space: ExtendedDSpace;
  makeNewCalculator(): void;
  showCalculator(c: Calculator): void;
  toggleFactSidebar(): void;
};

export const SpaceToolbar = React.memo<Props>(function SpaceToolbar({
  space,
  makeNewCalculator,
  showCalculator,
  toggleFactSidebar,
}) {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const me = useAppSelector((state) => state.me);
  const isLoggedIn = e.me.isLoggedIn(me);
  const [showTutorial, setShowTutorial] = useState(
    () => !!_.get(me, "profile.needs_tutorial")
  );

  const openTutorial = () => {
    setShowTutorial(true);
  };
  const closeTutorial = () => {
    if (me?.profile?.needs_tutorial) {
      dispatch(userActions.finishedTutorial(me.profile));
    }
    setShowTutorial(false);
  };

  const [importModalOpen, setImportModalOpen] = useState(false);

  const { editableByMe, calculators } = space;
  const actionState = space.canvasState.actionState;

  const editsAllowed = space.canvasState.editsAllowedManuallySet
    ? space.canvasState.editsAllowed
    : editableByMe;

  const canShowFactSidebar = canUseOrganizationFacts(space);

  const onAllowEdits = () => {
    dispatch(allowEdits());
  };
  const onForbidEdits = () => {
    dispatch(forbidEdits());
  };

  const onDestroy = () => {
    dispatch(spaceActions.destroy(space, router));
  };

  const handleImportSlurp = (slurp) => {
    setImportModalOpen(false);

    const spaceUpdates = parseSlurp(slurp, space);
    if (!space.name || !space.description) {
      let nonGraphUpdates: any = {};
      if (!space.name) {
        nonGraphUpdates.name = spaceUpdates.name;
      }
      if (!space.description) {
        nonGraphUpdates.description = spaceUpdates.description;
      }
      dispatch(spaceActions.update(space.id, nonGraphUpdates));
    }

    if (!_.isEmpty(spaceUpdates.newMetrics)) {
      dispatch({
        type: "ADD_METRICS",
        items: spaceUpdates.newMetrics,
        newGuesstimates: spaceUpdates.newGuesstimates,
      });
      dispatch(spaceActions.updateGraph(space.id));
      dispatch(
        simulationActions.runSimulations({
          spaceId: space.id,
          simulateSubset: spaceUpdates.newMetrics.map((m) => m.id),
        })
      );
    }
  };

  const onCopyModel = () => {
    dispatch(spaceActions.copy(space.id, router));
  };

  const onCopyMetrics = () => {
    dispatch(copiedActions.copy(space.id));
  };

  const onPasteMetrics = () => {
    dispatch(copiedActions.paste(space.id));
  };

  const onDeleteMetrics = () => {
    dispatch(removeSelectedMetrics(space.id));
  };

  const onCutMetrics = () => {
    dispatch(copiedActions.cut(space.id));
  };

  const onUndo = () => {
    dispatch(undo(space.id));
  };
  const onRedo = () => {
    dispatch(redo(space.id));
  };

  const canUndo =
    space.checkpointMetadata.head !== space.checkpointMetadata.length - 1;
  const canRedo = space.checkpointMetadata.head !== 0;

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
    <div className="hidden border-b border-[rgb(37,128,167)]/40 bg-[rgb(219,221,222)]/70 px-8 md:block">
      {showTutorial && <Tutorial onClose={closeTutorial} />}
      <Modal
        isOpen={importModalOpen}
        onRequestClose={() => {
          setImportModalOpen(false);
        }}
        style={customStyles}
      >
        <ImportFromSlurpForm onSubmit={handleImportSlurp} />
      </Modal>
      <div className="flex items-center justify-between py-1">
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

          <ToolbarTextItem onClick={openTutorial} text="Tutorial" />

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
