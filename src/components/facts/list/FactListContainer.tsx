import React from "react";

import { orArr } from "~/lib/engine/utils";
import * as organizationActions from "~/modules/organizations/actions";

import { Fact } from "~/lib/engine/facts";
import { useAppDispatch } from "~/modules/hooks";
import { FactList } from "./FactList";

type Props = {
  facts: Fact[];
  existingVariableNames: string[];
  categories?: any[];
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
