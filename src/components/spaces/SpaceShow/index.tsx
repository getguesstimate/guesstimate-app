import _ from "lodash";
import React, { useEffect, useReducer } from "react";

import Head from "next/head";

import { SpaceCanvas } from "~/components/spaces/SpaceCanvas";
import { SpaceHeader } from "./SpaceHeader";

import { LeftSidebar } from "./LeftSidebar";

import { SpaceToolbar } from "./SpaceToolbar";

import { denormalizedSpaceSelector } from "../denormalized-space-selector";

import { clearEditsAllowed } from "~/modules/canvas_state/actions";
import * as spaceActions from "~/modules/spaces/actions";

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
  const dispatch = useAppDispatch();

  const {
    denormalizedSpace: space,
    exportedFacts,
    organizationFacts,
  } = useAppSelector((state) =>
    denormalizedSpaceSelector(state, { spaceId: props.spaceId })
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

  if (!e.space.prepared(space)) {
    return null;
  }

  const leftSidebarIsVisible =
    space.editableByMe || !_.isEmpty(space.description);

  if (props.embed) {
    return (
      <div className="bg-[#c2cdd6]">
        <SpaceCanvas
          denormalizedSpace={space}
          canUseOrganizationFacts={e.space.canUseOrganizationFacts(space)}
          exportedFacts={exportedFacts}
          screenshot={true}
        />
      </div>
    );
  }

  const owner = e.space.getOwner(space);

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

      <div className="bg-gradient-to-r from-[#2583a7] to-[#2577a7]">
        <SpaceHeader space={space} />

        <SpaceToolbar
          space={space}
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
        />
      </div>

      <div className="max-h-full flex-1 flex">
        {leftSidebarIsVisible && (
          <div className="self-start">
            <LeftSidebar space={space} />
          </div>
        )}
        <div className="pt-4 pl-4 overflow-auto">
          <SpaceCanvas
            canUseOrganizationFacts={e.space.canUseOrganizationFacts(space)}
            exportedFacts={exportedFacts}
            denormalizedSpace={space}
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
