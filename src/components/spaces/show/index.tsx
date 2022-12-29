import _ from "lodash";
import { NextRouter, useRouter, withRouter } from "next/router";
import { Component } from "react";
import { connect } from "react-redux";

import $ from "jquery";
import Head from "next/head";

import { EditCalculatorForm } from "gComponents/calculators/edit";
import { NewCalculatorForm } from "gComponents/calculators/new";
import { CalculatorCompressedShow } from "gComponents/calculators/show/CalculatorCompressedShow";
import { FactListContainer } from "gComponents/facts/list/container";
import Canvas from "gComponents/spaces/canvas";
import {
  ButtonDeleteText,
  ButtonEditText,
  ButtonExpandText,
} from "gComponents/utility/buttons/button";
import { ButtonCloseText } from "gComponents/utility/buttons/close";
import { ClosedSpaceSidebar } from "./closed_sidebar";
import { SpaceHeader } from "./header";
import { SpaceSidebar } from "./sidebar";
import { SpaceToolbar } from "./Toolbar/index";
import { Tutorial } from "./Tutorial/index";

import { denormalizedSpaceSelector } from "../denormalized-space-selector";

import * as calculatorActions from "gModules/calculators/actions";
import {
  allowEdits,
  clearEditsAllowed,
  forbidEdits,
} from "gModules/canvas_state/actions";
import { redo, undo } from "gModules/checkpoints/actions";
import * as copiedActions from "gModules/copied/actions";
import { removeSelectedMetrics } from "gModules/metrics/actions";
import * as simulationActions from "gModules/simulations/actions";
import * as spaceActions from "gModules/spaces/actions";
import * as userActions from "gModules/users/actions";

import { parseSlurp } from "lib/slurpParser";

import * as e from "gEngine/engine";

import { Fact } from "gEngine/facts";
import { AppDispatch, RootState } from "gModules/store";
import * as elev from "servers/elev/index";

function mapStateToProps(state: RootState) {
  return {
    me: state.me,
  };
}

const ShowCalculatorHeader = ({
  id,
  editableByMe,
  onEdit,
  onDelete,
  onClose,
}) => {
  const router = useRouter();
  return (
    <div className="row">
      <div className="col-xs-12">
        <div className="button-close-text">
          <ButtonExpandText onClick={() => router.push(`/calculators/${id}`)} />
          {editableByMe && <ButtonEditText onClick={onEdit} />}
          {editableByMe && <ButtonDeleteText onClick={onDelete} />}
          <ButtonCloseText onClick={onClose} />
        </div>
      </div>
    </div>
  );
};

const CalculatorFormHeader = ({ isNew, onClose }) => (
  <div className="row">
    <div className="col-xs-8">
      <h2>{`${isNew ? "New" : "Edit"} Calculator`}</h2>
    </div>
    <div className="col-xs-4 button-close-text">
      <ButtonCloseText onClick={onClose} />
    </div>
  </div>
);

const FactSidebarHeader = ({ onClose, organizationId }) => {
  const router = useRouter();
  return (
    <div className="row">
      <div className="col-xs-6">
        <h2> Metric Library </h2>
      </div>
      <div className="col-xs-6">
        <ButtonExpandText
          onClick={() => router.push(`/organizations/${organizationId}/facts`)}
        />
        <div className="button-close-text">
          <ButtonCloseText onClick={onClose} />
        </div>
      </div>
    </div>
  );
};

type Props = {
  spaceId: string;
  showCalculatorId?: string;
  factsShown?: boolean;
  showCalculatorResults?: boolean;
  embed?: boolean;
  shareableLinkToken?: string | null;
  router: NextRouter;
  // these come from redux selectors
  me: RootState["me"];
  denormalizedSpace: any;
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
      editCalculatorId: string;
    }
  | {
      type: typeof SHOW_CALCULATOR;
      showCalculatorId: string;
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

class SpacesShow extends Component<Props, State> {
  state: State = {
    showLeftSidebar: true,
    showTutorial: !!_.get(this, "props.me.profile.needs_tutorial"),
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
    window.recorder.recordMountEvent(this);

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
    if (!!_.get(this, "props.me.profile.needs_tutorial")) {
      this.props.dispatch(userActions.finishedTutorial(this.props.me.profile));
    }
    this.setState({ showTutorial: false });
  }

  componentWillUnmount() {
    window.recorder.recordUnmountEvent(this);

    if (!this.props.embed) {
      elev.hide();
    }
  }

  componentWillUpdate() {
    window.recorder.recordRenderStartEvent(this);
    if (this.props.embed) {
      $("#intercom-container").remove();
    }
  }

  componentDidUpdate(prevProps) {
    window.recorder.recordRenderStopEvent(this);

    this.considerFetch(prevProps);
  }

  considerFetch({ denormalizedSpace: space }) {
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

  _handleCopyModel() {
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
    return parseInt(this.props.spaceId);
  }

  canUseOrganizationFacts() {
    const organization = _.get(this, "props.denormalizedSpace.organization");
    if (!organization) {
      return false;
    }

    const orgHasPrivateAccess = e.organization.hasPrivateAccess(organization);
    const isPrivate = _.get(this, "props.denormalizedSpace.is_private");
    return !!isPrivate && orgHasPrivateAccess;
  }

  closeRightSidebar() {
    elev.show();
    this.setState({ rightSidebar: { type: CLOSED } });
  }
  openRightSidebar(rightSidebarState) {
    elev.hide();
    this.setState({ rightSidebar: rightSidebarState });
  }
  showCalculator({ id }) {
    this.openRightSidebar({ type: SHOW_CALCULATOR, showCalculatorId: id });
  }
  editCalculator(id) {
    this.openRightSidebar({ type: EDIT_CALCULATOR_FORM, editCalculatorId: id });
  }
  deleteCalculator(id) {
    this.props.dispatch(calculatorActions.destroy(id));
    this.closeRightSidebar();
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

  rightSidebarBody() {
    const {
      props: { denormalizedSpace, spaceId, organizationFacts },
      state: { rightSidebar },
    } = this;
    const { editableByMe, calculators, organization, imported_fact_ids } =
      denormalizedSpace;
    switch (rightSidebar.type) {
      case CLOSED:
        return;
      case SHOW_CALCULATOR:
        return {
          classes: [],
          header: (
            <ShowCalculatorHeader
              editableByMe={editableByMe}
              id={rightSidebar.showCalculatorId}
              onEdit={this.editCalculator.bind(
                this,
                rightSidebar.showCalculatorId
              )}
              onDelete={this.deleteCalculator.bind(
                this,
                rightSidebar.showCalculatorId
              )}
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
      case EDIT_CALCULATOR_FORM:
        return {
          classes: [],
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
          classes: [],
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
          classes: ["grey"],
          header: (
            <FactSidebarHeader
              onClose={this.closeRightSidebar.bind(this)}
              organizationId={organization.id}
            />
          ),
          main: (
            <div className="SpaceRightSidebar--padded-area">
              <FactListContainer
                existingVariableNames={organizationFacts.map(e.facts.getVar)}
                facts={organizationFacts}
                organization={organization}
                canMakeNewFacts={true}
                spaceId={spaceId}
                imported_fact_ids={imported_fact_ids}
              />
            </div>
          ),
        };
    }
  }

  rightSidebar() {
    const rightSidebarBody = this.rightSidebarBody();
    if (!rightSidebarBody) {
      return null;
    }
    const { classes, header, main } = rightSidebarBody;

    return (
      <div className={["SpaceRightSidebar", ...classes].join(" ")}>
        <div className="SpaceRightSidebar--padded-area">{header}</div>
        <hr className="SpaceRightSidebar--divider" />
        {main}
      </div>
    );
  }

  render() {
    const { exportedFacts, organizationHasFacts, me } = this.props;
    const space = this.props.denormalizedSpace;

    if (!e.space.prepared(space)) {
      return <div className="spaceShow"></div>;
    }

    const sidebarIsViseable =
      space.editableByMe || !_.isEmpty(space.description);
    const isLoggedIn = e.me.isLoggedIn(this.props.me);
    const shareableLinkUrl = e.space.urlWithToken(space);

    if (this.props.embed) {
      return (
        <div className="spaceShow screenshot">
          <Canvas
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

        <div className="hero-unit">
          <SpaceHeader
            name={space.name}
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
            onCopyModel={this._handleCopyModel.bind(this)}
            onCopyMetrics={this.onCopy.bind(this, false)}
            onPasteMetrics={this.onPaste.bind(this, false)}
            onDeleteMetrics={this.onDeleteMetrics.bind(this)}
            onCutMetrics={this.onCut.bind(this, false)}
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

        <div className="content">
          {sidebarIsViseable && this.state.showLeftSidebar && (
            <SpaceSidebar
              description={space.description}
              canEdit={space.editableByMe}
              onClose={this.hideLeftSidebar.bind(this)}
              onSaveDescription={this.onSaveDescription.bind(this)}
            />
          )}
          {sidebarIsViseable && !this.state.showLeftSidebar && (
            <ClosedSpaceSidebar onOpen={this.openLeftSidebar.bind(this)} />
          )}
          <Canvas
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

export default connect(mapStateToProps)(
  connect(denormalizedSpaceSelector)(withRouter(SpacesShow))
);