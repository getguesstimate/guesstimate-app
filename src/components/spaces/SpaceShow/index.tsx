import _ from "lodash";
import { useRouter } from "next/router";
import React, { useEffect, useReducer, useState } from "react";

import Head from "next/head";

import { SpaceCanvas } from "~/components/spaces/SpaceCanvas";
import { SpaceHeader } from "./SpaceHeader";

import { LeftSidebar } from "./LeftSidebar";

import { SpaceToolbar } from "./SpaceToolbar";
import { Tutorial } from "./Tutorial";

import { denormalizedSpaceSelector } from "../denormalized-space-selector";

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

import { Calculator } from "~/modules/calculators/reducer";
import { useAppDispatch, useAppSelector } from "~/modules/hooks";
import * as elev from "~/server/elev/index";
import {
  RightSidebar,
  rightSidebarReducer,
  RightSidebarState,
} from "./RightSidebar";

type Props = {
  spaceId: number;
  showCalculatorId?: number;
  factsShown?: boolean;
  showCalculatorResults?: boolean;
  embed?: boolean;
  shareableLinkToken?: string | null;
};

export const SpaceShow: React.FC<Props> = (props) => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const me = useAppSelector((state) => state.me);
  const {
    denormalizedSpace: space,
    exportedFacts,
    organizationFacts,
    organizationHasFacts,
  } = useAppSelector((state) =>
    denormalizedSpaceSelector(state, { spaceId: props.spaceId })
  );

  const [showTutorial, setShowTutorial] = useState(
    () => !!_.get(me, "profile.needs_tutorial")
  );
  const [rightSidebar, rightSidebarDispatch] = useReducer(
    rightSidebarReducer,
    null,
    (): RightSidebarState =>
      props.showCalculatorId
        ? {
            type: "SHOW_CALCULATOR",
            showCalculatorResults: props.showCalculatorResults,
            showCalculatorId: props.showCalculatorId,
          }
        : props.factsShown
        ? { type: "FACT_SIDEBAR" }
        : { type: "CLOSED" }
  );

  useEffect(() => {
    const hasGraph = _.has(space, "graph");
    const hasData = hasGraph && e.space.prepared(space);

    if (!hasData) {
      dispatch(spaceActions.fetchById(props.spaceId, props.shareableLinkToken));
    }

    dispatch(clearEditsAllowed());
  }, []);

  useEffect(() => {
    if (props.embed) {
      return;
    }

    if (rightSidebar.type === "CLOSED") {
      elev.show();
    }
    return () => {
      elev.hide();
    };
  }, []);

  const openTutorial = () => {
    setShowTutorial(true);
  };
  const closeTutorial = () => {
    if (me?.profile?.needs_tutorial) {
      dispatch(userActions.finishedTutorial(me.profile));
    }
    setShowTutorial(false);
  };

  const onRedo = () => {
    dispatch(redo(space.id));
  };

  const onUndo = () => {
    dispatch(undo(space.id));
  };

  const destroy = () => {
    dispatch(spaceActions.destroy(space, router));
  };

  const onImportSlurp = (slurpObj) => {
    const spaceUpdates = parseSlurp(slurpObj, space);
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

  const handleCopyModel = () => {
    dispatch(spaceActions.copy(space.id, router));
  };

  const onPublicSelect = () => {
    dispatch(spaceActions.generalUpdate(space.id, { is_private: false }));
  };
  const onPrivateSelect = () => {
    dispatch(spaceActions.generalUpdate(space.id, { is_private: true }));
  };

  const onEnableShareableLink = () => {
    dispatch(spaceActions.enableShareableLink(space.id));
  };
  const onDisableShareableLink = () => {
    dispatch(spaceActions.disableShareableLink(space.id));
  };
  const onRotateShareableLink = () => {
    dispatch(spaceActions.rotateShareableLink(space.id));
  };

  const onSaveName = (name: string) => {
    dispatch(spaceActions.update(space.id, { name }));
  };
  const onCopy = () => {
    dispatch(copiedActions.copy(space.id));
  };

  const onPaste = () => {
    dispatch(copiedActions.paste(space.id));
  };

  const onDeleteMetrics = () => {
    dispatch(removeSelectedMetrics(space.id));
  };

  const onCut = () => {
    dispatch(copiedActions.cut(space.id));
  };

  const canUseOrganizationFacts = () => {
    const organization = space.organization;
    if (!organization) {
      return false;
    }

    const orgHasPrivateAccess = e.organization.hasPrivateAccess(organization);
    const isPrivate = space.is_private;
    return !!isPrivate && orgHasPrivateAccess;
  };

  if (!e.space.prepared(space)) {
    return null;
  }

  const sidebarIsVisible = space.editableByMe || !_.isEmpty(space.description);
  const isLoggedIn = e.me.isLoggedIn(me);
  const shareableLinkUrl = e.space.urlWithToken(space);

  if (props.embed) {
    return (
      <div className="bg-[#c2cdd6]">
        <SpaceCanvas
          denormalizedSpace={space}
          canUseOrganizationFacts={canUseOrganizationFacts()}
          exportedFacts={exportedFacts}
          screenshot={true}
        />
      </div>
    );
  }

  const hasOrg = space.organization?.name;
  const owner = hasOrg ? space.organization : space.user;
  const { users } = space;
  const ownerUrl = hasOrg
    ? e.organization.url(space.organization)
    : e.user.url(space.user);

  const canBePrivate = hasOrg
    ? e.organization.canMakeMorePrivateModels(space.organization)
    : e.me.canMakeMorePrivateModels(me);

  const authorCallout = `Made by ${owner.name}`;
  const tagDescription = _.isEmpty(space.description)
    ? authorCallout
    : `${authorCallout}: ${space.description}`;

  const pageTitle = `${space.name} | Guesstimate`;

  return (
    <div className="flex-1 flex flex-col h-full bg-[#dfe1e4]">
      <Head>
        {space.name && <title key="title">{pageTitle}</title>}
        {[
          { name: "description", content: tagDescription },
          ...(space.name ? [{ property: "og:title", content: pageTitle }] : []),
          { property: "og:description", content: tagDescription },
          { property: "og:site_name", content: "Guesstimate" },
          { property: "og:image", content: space.big_screenshot },
        ].map((tag) => (
          <meta {...tag} key={tag.name || tag.property} />
        ))}
      </Head>
      {showTutorial && <Tutorial onClose={closeTutorial} />}

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
          onSaveName={onSaveName}
          onPublicSelect={onPublicSelect}
          onPrivateSelect={onPrivateSelect}
          onEnableShareableLink={onEnableShareableLink}
          onDisableShareableLink={onDisableShareableLink}
          onRotateShareableLink={onRotateShareableLink}
        />

        <SpaceToolbar
          editsAllowed={
            space.canvasState.editsAllowedManuallySet
              ? space.canvasState.editsAllowed
              : space.editableByMe
          }
          onAllowEdits={() => {
            dispatch(allowEdits());
          }}
          onForbidEdits={() => {
            dispatch(forbidEdits());
          }}
          isLoggedIn={isLoggedIn}
          onDestroy={destroy}
          onCopyModel={handleCopyModel}
          onCopyMetrics={onCopy}
          onPasteMetrics={onPaste}
          onDeleteMetrics={onDeleteMetrics}
          onCutMetrics={onCut}
          isPrivate={space.is_private}
          editableByMe={space.editableByMe}
          actionState={space.canvasState.actionState}
          onUndo={onUndo}
          onRedo={onRedo}
          canUndo={
            space.checkpointMetadata.head !==
            space.checkpointMetadata.length - 1
          }
          canRedo={space.checkpointMetadata.head !== 0}
          onImportSlurp={onImportSlurp}
          calculators={space.calculators}
          makeNewCalculator={() =>
            rightSidebarDispatch({ type: "MAKE_NEW_CALCULATOR" })
          }
          showCalculator={(calculator: Calculator) =>
            rightSidebarDispatch({
              type: "SHOW_CALCULATOR",
              payload: calculator,
            })
          }
          toggleFactSidebar={() =>
            rightSidebarDispatch({ type: "TOGGLE_FACTS" })
          }
          canShowFactSidebar={canUseOrganizationFacts()}
          onOpenTutorial={openTutorial}
        />
      </div>

      <div className="max-h-full flex-1 flex">
        {sidebarIsVisible && (
          <div className="self-start">
            <LeftSidebar space={space} />
          </div>
        )}
        <div className="pt-4 pl-4 overflow-auto">
          <SpaceCanvas
            canUseOrganizationFacts={canUseOrganizationFacts()}
            exportedFacts={exportedFacts}
            denormalizedSpace={space}
            onCopy={onCopy}
            onPaste={onPaste}
            onCut={onCut}
          />
        </div>
        <RightSidebar
          space={space}
          rightSidebarDispatch={rightSidebarDispatch}
          organizationFacts={organizationFacts}
          state={rightSidebar}
        />
      </div>
    </div>
  );
};
