import _ from "lodash";
import { NextRouter, withRouter } from "next/router";
import React, { Component } from "react";
import { connect } from "react-redux";

import Head from "next/head";

import { EditCalculatorForm } from "~/components/calculators/EditCalculatorForm";
import { NewCalculatorForm } from "~/components/calculators/NewCalculatorForm";
import { CalculatorCompressedShow } from "~/components/calculators/show/CalculatorCompressedShow";
import { FactListContainer } from "~/components/facts/list/FactListContainer";
import { SpaceCanvas } from "~/components/spaces/SpaceCanvas";
import {
  ButtonDeleteText,
  ButtonEditText,
  ButtonExpandText,
} from "~/components/utility/buttons/button";
import { ButtonCloseText } from "~/components/utility/buttons/close";
import { ClosedSpaceSidebar } from "./ClosedSpaceSidebar";
import { SpaceHeader } from "./SpaceHeader";
import { SpaceSidebar } from "./SpaceSidebar";
import { SpaceToolbar } from "./SpaceToolbar";
import { Tutorial } from "./Tutorial";

import {
  denormalizedSpaceSelector,
  ExtendedDSpace,
} from "../denormalized-space-selector";

import * as calculatorActions from "~/modules/calculators/actions";
import {
  allowEdits,
  clearEditsAllowed,
  forbidEdits,
} from "~/modules/canvas_state/actions";
import { redo, undo } from "~/modules/checkpoints/actions";
import * as copiedActions from "~/modules/copied/actions";
import { removeSelectedMetrics } from "~/modules/metrics/actions";
import * as simulationActions from "~/modules/simulations/actions";
import * as spaceActions from "~/modules/spaces/actions";
import * as userActions from "~/modules/users/actions";

import { parseSlurp } from "~/lib/slurpParser";

import * as e from "~/lib/engine/engine";

import { Fact } from "~/lib/engine/facts";
import { Calculator } from "~/modules/calculators/reducer";
import { AppDispatch, RootState } from "~/modules/store";
import * as elev from "~/server/elev/index";
import clsx from "clsx";

function mapStateToProps(state: RootState) {
  return {
    me: state.me,
  };
}

const HeaderTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h2 className="text-[#476b82]">{children}</h2>
);

const ShowCalculatorHeader: React.FC<{
  id: number;
  editableByMe: boolean;
  onEdit(): void;
  onDelete(): void;
  onClose(): void;
}> = ({ id, editableByMe, onEdit, onDelete, onClose }) => {
  return (
    <div className="flex justify-end items-start flex-wrap gap-1">
      <ButtonExpandText href={`/calculators/${id}`} />
      {editableByMe && <ButtonEditText onClick={onEdit} />}
      {editableByMe && <ButtonDeleteText onClick={onDelete} />}
      <ButtonCloseText onClick={onClose} />
    </div>
  );
};

const CalculatorFormHeader: React.FC<{
  isNew: boolean;
  onClose(): void;
}> = ({ isNew, onClose }) => (
  <div className="flex justify-between items-start">
    <HeaderTitle>{isNew ? "New" : "Edit"} Calculator</HeaderTitle>
    <ButtonCloseText onClick={onClose} />
  </div>
);

const FactSidebarHeader: React.FC<{
  onClose(): void;
  organizationId: string | number;
}> = ({ onClose, organizationId }) => {
  return (
    <div className="flex justify-between items-start">
      <HeaderTitle>Metric Library</HeaderTitle>
      <div className="flex gap-1">
        <ButtonExpandText href={`/organizations/${organizationId}/facts`} />
        <ButtonCloseText onClick={onClose} />
      </div>
    </div>
  );
};

type Props = {
  spaceId: number;
  showCalculatorId?: number;
  factsShown?: boolean;
  showCalculatorResults?: boolean;
  embed?: boolean;
  shareableLinkToken?: string | null;
  router: NextRouter;
  // these come from redux selectors
  me: RootState["me"];
  denormalizedSpace: ExtendedDSpace;
  exportedFacts: any;
  organizationFacts: Fact[];
  organizationHasFacts: boolean;
} & { dispatch: AppDispatch };

const CLOSED = 0;
const NEW_CALCULATOR_FORM = 1;
const EDIT_CALCULATOR_FORM = 2;
const SHOW_CALCULATOR = 3;
const FACT_SIDEBAR = 4;

type RightSidebarState =
  | {
      type: typeof CLOSED;
    }
  | {
      type: typeof NEW_CALCULATOR_FORM;
    }
  | {
      type: typeof EDIT_CALCULATOR_FORM;
      editCalculatorId: number;
    }
  | {
      type: typeof SHOW_CALCULATOR;
      showCalculatorId: number;
      showCalculatorResults?: boolean;
    }
  | {
      type: typeof FACT_SIDEBAR;
    };

type State = {
  showLeftSidebar: boolean;
  showTutorial: boolean;
  attemptedFetch: boolean;
  rightSidebar: RightSidebarState;
};

class UnconnectedSpaceShow extends Component<Props, State> {
  state: State = {
    showLeftSidebar: true,
    showTutorial: !!_.get(this.props.me, "profile.needs_tutorial"),
    attemptedFetch: false,
    rightSidebar: this.props.showCalculatorId
      ? {
          type: SHOW_CALCULATOR,
          showCalculatorResults: this.props.showCalculatorResults,
          showCalculatorId: this.props.showCalculatorId,
        }
      : this.props.factsShown
      ? { type: FACT_SIDEBAR }
      : { type: CLOSED },
  };

  componentWillMount() {
    this.considerFetch(this.props);
    this.props.dispatch(clearEditsAllowed());
    if (!(this.props.embed || this.state.rightSidebar.type !== CLOSED)) {
      elev.show();
    }
  }

  openTutorial() {
    this.setState({ showTutorial: true });
  }
  closeTutorial() {
    if (this.props.me?.profile?.needs_tutorial) {
      this.props.dispatch(userActions.finishedTutorial(this.props.me.profile));
    }
    this.setState({ showTutorial: false });
  }

  componentWillUnmount() {
    if (!this.props.embed) {
      elev.hide();
    }
  }

  componentWillUpdate() {
    // if (this.props.embed) {
    //   $("#intercom-container").remove();
    // }
  }

  componentDidUpdate(prevProps: Props) {
    this.considerFetch(prevProps);
  }

  considerFetch({ denormalizedSpace: space }: Props) {
    if (this.state.attemptedFetch) {
      return;
    }

    const hasGraph = _.has(space, "graph");
    const hasData = hasGraph && e.space.prepared(space);

    if (!hasData) {
      this.props.dispatch(
        spaceActions.fetchById(this._id(), this.props.shareableLinkToken)
      );
      this.setState({ attemptedFetch: true });
    }
  }

  onSave() {
    this.props.dispatch(spaceActions.update(this._id()));
  }

  onRedo() {
    this.props.dispatch(redo(this._id()));
  }

  onUndo() {
    this.props.dispatch(undo(this._id()));
  }

  destroy() {
    this.props.dispatch(
      spaceActions.destroy(this.props.denormalizedSpace, this.props.router)
    );
  }

  onImportSlurp(slurpObj) {
    const space = this.props.denormalizedSpace;

    const spaceUpdates = parseSlurp(slurpObj, space);
    if (!space.name || !space.description) {
      let nonGraphUpdates: any = {};
      if (!space.name) {
        nonGraphUpdates.name = spaceUpdates.name;
      }
      if (!space.description) {
        nonGraphUpdates.description = spaceUpdates.description;
      }
      this.props.dispatch(spaceActions.update(this._id(), nonGraphUpdates));
    }
    if (!_.isEmpty(spaceUpdates.newMetrics)) {
      this.props.dispatch({
        type: "ADD_METRICS",
        items: spaceUpdates.newMetrics,
        newGuesstimates: spaceUpdates.newGuesstimates,
      });
      this.props.dispatch(spaceActions.updateGraph(this._id()));
      this.props.dispatch(
        simulationActions.runSimulations({
          spaceId: this._id(),
          simulateSubset: spaceUpdates.newMetrics.map((m) => m.id),
        })
      );
    }
  }

  onPublicSelect() {
    this.props.dispatch(
      spaceActions.generalUpdate(this._id(), { is_private: false })
    );
  }
  onPrivateSelect() {
    this.props.dispatch(
      spaceActions.generalUpdate(this._id(), { is_private: true })
    );
  }

  onEnableShareableLink() {
    this.props.dispatch(spaceActions.enableShareableLink(this._id()));
  }
  onDisableShareableLink() {
    this.props.dispatch(spaceActions.disableShareableLink(this._id()));
  }
  onRotateShareableLink() {
    this.props.dispatch(spaceActions.rotateShareableLink(this._id()));
  }

  onSaveName(name) {
    this.props.dispatch(spaceActions.update(this._id(), { name }));
  }
  onSaveDescription(description) {
    this.props.dispatch(spaceActions.update(this._id(), { description }));
  }

  hideLeftSidebar() {
    this.setState({ showLeftSidebar: false });
  }
  openLeftSidebar() {
    this.setState({ showLeftSidebar: true });
  }

  handleCopyModel() {
    this.props.dispatch(spaceActions.copy(this._id(), this.props.router));
  }

  onCopy() {
    this.props.dispatch(copiedActions.copy(this._id()));
  }

  onPaste() {
    this.props.dispatch(copiedActions.paste(this._id()));
  }

  onDeleteMetrics() {
    this.props.dispatch(removeSelectedMetrics(this.props.spaceId));
  }

  onCut() {
    this.props.dispatch(copiedActions.cut(this._id()));
  }

  _id() {
    return this.props.spaceId;
  }

  canUseOrganizationFacts() {
    const organization = this.props.denormalizedSpace.organization;
    if (!organization) {
      return false;
    }

    const orgHasPrivateAccess = e.organization.hasPrivateAccess(organization);
    const isPrivate = this.props.denormalizedSpace.is_private;
    return !!isPrivate && orgHasPrivateAccess;
  }

  closeRightSidebar() {
    elev.show();
    this.setState({ rightSidebar: { type: CLOSED } });
  }
  openRightSidebar(rightSidebarState: RightSidebarState) {
    elev.hide();
    this.setState({ rightSidebar: rightSidebarState });
  }
  showCalculator({ id }: Calculator) {
    this.openRightSidebar({ type: SHOW_CALCULATOR, showCalculatorId: id });
  }
  makeNewCalculator() {
    this.openRightSidebar({ type: NEW_CALCULATOR_FORM });
  }
  toggleFactSidebar() {
    if (this.state.rightSidebar.type !== FACT_SIDEBAR) {
      this.openRightSidebar({ type: FACT_SIDEBAR });
    } else {
      this.closeRightSidebar();
    }
  }

  rightSidebarBody():
    | { bg?: "GREY"; header: JSX.Element; main: JSX.Element }
    | undefined {
    const {
      props: { denormalizedSpace, spaceId, organizationFacts },
      state: { rightSidebar },
    } = this;
    const { editableByMe, calculators, organization, imported_fact_ids } =
      denormalizedSpace;

    switch (rightSidebar.type) {
      case CLOSED:
        return;
      case SHOW_CALCULATOR: {
        const editCalculator = () => {
          this.openRightSidebar({
            type: EDIT_CALCULATOR_FORM,
            editCalculatorId: rightSidebar.showCalculatorId,
          });
        };
        const deleteCalculator = () => {
          this.props.dispatch(
            calculatorActions.destroy(rightSidebar.showCalculatorId)
          );
          this.closeRightSidebar();
        };

        return {
          header: (
            <ShowCalculatorHeader
              editableByMe={editableByMe}
              id={rightSidebar.showCalculatorId}
              onEdit={editCalculator}
              onDelete={deleteCalculator}
              onClose={this.closeRightSidebar.bind(this)}
            />
          ),
          main: (
            <CalculatorCompressedShow
              calculatorId={rightSidebar.showCalculatorId}
              startFilled={rightSidebar.showCalculatorResults}
            />
          ),
        };
      }
      case EDIT_CALCULATOR_FORM:
        return {
          header: (
            <CalculatorFormHeader
              isNew={false}
              onClose={this.closeRightSidebar.bind(this)}
            />
          ),
          main: (
            <EditCalculatorForm
              space={denormalizedSpace}
              calculator={calculators.find(
                (c) => c.id === rightSidebar.editCalculatorId
              )}
              onCalculatorSave={this.showCalculator.bind(this)}
            />
          ),
        };
      case NEW_CALCULATOR_FORM:
        return {
          header: (
            <CalculatorFormHeader
              isNew={true}
              onClose={this.closeRightSidebar.bind(this)}
            />
          ),
          main: (
            <NewCalculatorForm
              space={denormalizedSpace}
              onCalculatorSave={this.showCalculator.bind(this)}
            />
          ),
        };
      case FACT_SIDEBAR:
        return {
          bg: "GREY",
          header: (
            <FactSidebarHeader
              onClose={this.closeRightSidebar.bind(this)}
              organizationId={organization.id}
            />
          ),
          main: (
            <FactListContainer
              existingVariableNames={organizationFacts.map(e.facts.getVar)}
              facts={organizationFacts}
              organization={organization}
              canMakeNewFacts={true}
              spaceId={spaceId}
              imported_fact_ids={imported_fact_ids}
            />
          ),
        };
    }
  }

  rightSidebar() {
    const rightSidebarBody = this.rightSidebarBody();
    if (!rightSidebarBody) {
      return null;
    }
    const { bg, header, main } = rightSidebarBody;

    return (
      <div
        className={clsx(
          "w-[30em] h-full p-4 overflow-x-hidden overflow-y-auto border-l border-[#ccc]",
          bg === "GREY" ? "bg-grey-6" : "bg-white"
        )}
      >
        <div className="pb-4">{header}</div>
        <div>{main}</div>
      </div>
    );
  }

  render() {
    const { exportedFacts, denormalizedSpace: space } = this.props;

    if (!e.space.prepared(space)) {
      return <div className="spaceShow" />;
    }

    const sidebarIsVisible =
      space.editableByMe || !_.isEmpty(space.description);
    const isLoggedIn = e.me.isLoggedIn(this.props.me);
    const shareableLinkUrl = e.space.urlWithToken(space);

    if (this.props.embed) {
      return (
        <div className="spaceShow screenshot">
          <SpaceCanvas
            denormalizedSpace={space}
            canUseOrganizationFacts={this.canUseOrganizationFacts()}
            exportedFacts={exportedFacts}
            screenshot={true}
          />
        </div>
      );
    }

    const hasOrg = _.has(space, "organization.name");
    const owner = hasOrg ? space.organization : space.user;
    const { users } = space;
    const ownerUrl = hasOrg
      ? e.organization.url(space.organization)
      : e.user.url(space.user);

    const canBePrivate = hasOrg
      ? e.organization.canMakeMorePrivateModels(space.organization)
      : e.me.canMakeMorePrivateModels(this.props.me);

    const authorCallout = `Made by ${owner.name}`;
    const tagDescription = _.isEmpty(space.description)
      ? authorCallout
      : `${authorCallout}: ${space.description}`;

    const pageTitle = `${space.name} | Guesstimate`;

    return (
      <div className="spaceShow">
        <Head>
          {space.name && <title key="title">{pageTitle}</title>}
          {[
            { name: "description", content: tagDescription },
            ...(space.name
              ? [{ property: "og:title", content: pageTitle }]
              : []),
            { property: "og:description", content: tagDescription },
            { property: "og:site_name", content: "Guesstimate" },
            { property: "og:image", content: space.big_screenshot },
          ].map((tag) => (
            <meta {...tag} key={tag.name || tag.property} />
          ))}
        </Head>
        {this.state.showTutorial && (
          <Tutorial onClose={this.closeTutorial.bind(this)} />
        )}

        <div className="bg-gradient-to-r from-[#2583a7] to-[#2577a7]">
          <SpaceHeader
            name={space.name || ""}
            isPrivate={space.is_private}
            editableByMe={space.editableByMe}
            canBePrivate={canBePrivate}
            shareableLinkUrl={shareableLinkUrl}
            ownerName={owner.name}
            ownerPicture={owner.picture}
            ownerUrl={ownerUrl}
            ownerIsOrg={hasOrg}
            editors={users}
            onSaveName={this.onSaveName.bind(this)}
            onPublicSelect={this.onPublicSelect.bind(this)}
            onPrivateSelect={this.onPrivateSelect.bind(this)}
            onEnableShareableLink={this.onEnableShareableLink.bind(this)}
            onDisableShareableLink={this.onDisableShareableLink.bind(this)}
            onRotateShareableLink={this.onRotateShareableLink.bind(this)}
          />

          <SpaceToolbar
            editsAllowed={
              space.canvasState.editsAllowedManuallySet
                ? space.canvasState.editsAllowed
                : space.editableByMe
            }
            onAllowEdits={() => {
              this.props.dispatch(allowEdits());
            }}
            onForbidEdits={() => {
              this.props.dispatch(forbidEdits());
            }}
            isLoggedIn={isLoggedIn}
            onDestroy={this.destroy.bind(this)}
            onCopyModel={this.handleCopyModel.bind(this)}
            onCopyMetrics={this.onCopy.bind(this, false)}
            onPasteMetrics={this.onPaste.bind(this)}
            onDeleteMetrics={this.onDeleteMetrics.bind(this)}
            onCutMetrics={this.onCut.bind(this)}
            isPrivate={space.is_private}
            editableByMe={space.editableByMe}
            actionState={space.canvasState.actionState}
            onUndo={this.onUndo.bind(this)}
            onRedo={this.onRedo.bind(this)}
            canUndo={
              space.checkpointMetadata.head !==
              space.checkpointMetadata.length - 1
            }
            canRedo={space.checkpointMetadata.head !== 0}
            onImportSlurp={this.onImportSlurp.bind(this)}
            calculators={space.calculators}
            makeNewCalculator={this.makeNewCalculator.bind(this)}
            showCalculator={this.showCalculator.bind(this)}
            toggleFactSidebar={this.toggleFactSidebar.bind(this)}
            canShowFactSidebar={this.canUseOrganizationFacts()}
            onOpenTutorial={this.openTutorial.bind(this)}
          />
        </div>

        <div className="max-h-full flex-1 flex">
          {sidebarIsVisible && (
            <div className="self-start">
              {this.state.showLeftSidebar ? (
                <SpaceSidebar
                  description={space.description || ""}
                  canEdit={space.editableByMe}
                  onClose={this.hideLeftSidebar.bind(this)}
                  onSaveDescription={this.onSaveDescription.bind(this)}
                />
              ) : (
                <ClosedSpaceSidebar onOpen={this.openLeftSidebar.bind(this)} />
              )}
            </div>
          )}
          <SpaceCanvas
            canUseOrganizationFacts={this.canUseOrganizationFacts()}
            exportedFacts={exportedFacts}
            denormalizedSpace={space}
            onCopy={this.onCopy.bind(this, true)}
            onPaste={this.onPaste.bind(this, true)}
            onCut={this.onCut.bind(this, true)}
          />
          {this.rightSidebar()}
        </div>
      </div>
    );
  }
}

export const SpaceShow = connect(mapStateToProps)(
  connect(denormalizedSpaceSelector)(withRouter(UnconnectedSpaceShow))
);
