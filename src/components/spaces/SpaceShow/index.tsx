import React, { useEffect, useReducer } from "react";

import _ from "lodash";
import Head from "next/head";
import { SpaceCanvas } from "~/components/spaces/SpaceCanvas";
import * as e from "~/lib/engine/engine";
import { clearEditsAllowed } from "~/modules/canvas_state/actions";
import { useAppDispatch, useAppSelector } from "~/modules/hooks";
import * as spaceActions from "~/modules/spaces/actions";
import * as elev from "~/server/elev/index";

import { denormalizedSpaceSelector } from "../denormalized-space-selector";
import { LeftSidebar } from "./LeftSidebar";
import {
  RightSidebar,
  rightSidebarReducer,
  RightSidebarState,
} from "./RightSidebar";
import { SpaceHeader } from "./SpaceHeader";
import { SpaceToolbar } from "./SpaceToolbar";

type Props = {
  spaceId: number;
  showCalculatorId?: number;
  factsShown?: boolean;
  showCalculatorResults?: boolean;
  embed?: boolean;
  shareableLinkToken?: string | null;
};

export const SpaceShow: React.FC<Props> = ({
  spaceId,
  showCalculatorId,
  factsShown,
  showCalculatorResults,
  embed,
  shareableLinkToken,
}) => {
  const dispatch = useAppDispatch();

  const {
    denormalizedSpace: space,
    exportedFacts,
    organizationFacts,
  } = useAppSelector((state) => denormalizedSpaceSelector(state, { spaceId }));

  const [rightSidebar, rightSidebarDispatch] = useReducer(
    rightSidebarReducer,
    null,
    (): RightSidebarState =>
      showCalculatorId
        ? {
            type: "SHOW_CALCULATOR",
            showCalculatorResults,
            showCalculatorId,
          }
        : factsShown
        ? { type: "FACT_SIDEBAR" }
        : { type: "CLOSED" }
  );

  useEffect(() => {
    const hasGraph = _.has(space, "graph");
    const hasData = hasGraph && e.space.prepared(space);

    if (!hasData) {
      dispatch(spaceActions.fetchById(spaceId, shareableLinkToken));
    }

    dispatch(clearEditsAllowed());
  }, []);

  useEffect(() => {
    if (embed) {
      return;
    }

    if (rightSidebar.type === "CLOSED") {
      elev.show();
    }
    return () => elev.hide();
  }, []);

  if (!e.space.prepared(space)) {
    return null;
  }

  if (embed) {
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

  const leftSidebarIsVisible =
    space.editableByMe || !_.isEmpty(space.description);

  return (
    <div className="flex h-full flex-1 flex-col bg-[#dfe1e4]">
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
          showCalculator={(calculator) =>
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

      <div className="flex max-h-full flex-1">
        {leftSidebarIsVisible && (
          <div className="self-start">
            <LeftSidebar space={space} />
          </div>
        )}
        <div className="grid place-items-stretch pt-4 pl-4">
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
