import React, { Component } from "react";
import { connect } from "react-redux";

import { orArr } from "gEngine/utils";
import * as organizationActions from "gModules/organizations/actions";

import { FactList } from "./list";
import { Fact } from "gEngine/facts";
import { useAppDispatch } from "gModules/hooks";

type Props = {
  facts: Fact[];
  existingVariableNames: string[];
  categories?: unknown;
  organization: unknown;
  categoryId?: string | null;
  canMakeNewFacts: boolean;
  spaceId?: number;
  imported_fact_ids?: string[];
};

export const FactListContainer: React.FC<Props> = ({
  facts,
  existingVariableNames,
  categories,
  organization,
  categoryId,
  canMakeNewFacts,
  spaceId,
  imported_fact_ids,
}) => {
  const dispatch = useAppDispatch();
  return (
    <FactList
      onDeleteFact={(fact) =>
        dispatch(organizationActions.deleteFact(organization, fact))
      }
      onAddFact={(fact) =>
        dispatch(organizationActions.addFact(organization, fact))
      }
      onEditFact={(fact) =>
        dispatch(organizationActions.editFact(organization, fact, true))
      }
      facts={facts}
      existingVariableNames={existingVariableNames}
      categories={orArr(categories)}
      categoryId={categoryId}
      canMakeNewFacts={canMakeNewFacts}
      spaceId={spaceId}
      imported_fact_ids={imported_fact_ids}
    />
  );
};
