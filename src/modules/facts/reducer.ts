import _ from "lodash";
import { AnyAction, Reducer } from "redux";
import * as _collections from "~/lib/engine/collections";
import { mutableCopy, typeSafeEq } from "~/lib/engine/utils";

import CITIES from "./cities.json";

type State = {
  currentSuggestion: string;
  globalFacts: unknown;
  organizationFacts: any[]; // FIXME
};

const INITIAL_STATE: State = {
  currentSuggestion: "",
  globalFacts: CITIES,
  organizationFacts: [],
};

export const factsR: Reducer<State, AnyAction> = (
  state = INITIAL_STATE,
  action
) => {
  switch (action.type) {
    case "LOAD_FACTS_BY_ORG":
      return {
        ...state,
        organizationFacts: [
          ...action.facts,
          ...state.organizationFacts.filter(
            (e) =>
              !_.some(action.facts, (f) => f.variable_name === e.variable_name)
          ),
        ],
      };
    case "ADD_FACT_TO_ORG": {
      const oldOrganizationFact = state.organizationFacts.find(
        (e) => e.variable_name === action.organizationVariableName
      );
      const oldChildren = _.get(oldOrganizationFact, "children") || [];
      const newOrganizationFact = {
        variable_name: action.organizationVariableName,
        children: [...oldChildren, action.fact],
      };
      return {
        ...state,
        organizationFacts: [
          newOrganizationFact,
          ...state.organizationFacts.filter(
            (e) => e.variable_name !== newOrganizationFact.variable_name
          ),
        ],
      };
    }
    case "UPDATE_FACT_WITHIN_ORG": {
      const oldOrganizationFact = state.organizationFacts.find(
        (e) => e.variable_name === action.organizationVariableName
      );
      if (!oldOrganizationFact) {
        return {
          ...state,
          organizationFacts: [
            {
              variable_name: action.organizationVariableName,
              children: [action.fact],
            },
            ...state.organizationFacts,
          ],
        };
      }

      const oldFactIndex = oldOrganizationFact.children.findIndex(
        (c) => c.id === action.fact.id
      );
      const childrenBefore = oldOrganizationFact.children.slice(
        0,
        oldFactIndex
      );
      const childrenAfter = oldOrganizationFact.children.slice(
        oldFactIndex + 1
      );
      return {
        ...state,
        organizationFacts: [
          {
            variable_name: action.organizationVariableName,
            children: [...childrenBefore, action.fact, ...childrenAfter],
          },
          ...state.organizationFacts.filter(
            (e) => e.variable_name !== action.organizationVariableName
          ),
        ],
      };
    }
    case "DELETE_FACT_FROM_ORG": {
      const organizationFact = state.organizationFacts.find(
        (e) => e.variable_name === action.organizationVariableName
      );
      const children = organizationFact
        ? organizationFact.children.filter((c) => c.id !== action.id)
        : [];
      return {
        ...state,
        organizationFacts: [
          {
            variable_name: action.organizationVariableName,
            children,
          },
          ...state.organizationFacts.filter(
            (e) => e.variable_name !== action.organizationVariableName
          ),
        ],
      };
    }
    case "SUGGEST_FACT":
      return {
        ...state,
        currentSuggestion: action.suggestion,
      };
    case "CLEAR_SUGGESTION":
      return {
        ...state,
        currentSuggestion: INITIAL_STATE.currentSuggestion,
      };
    case "FACT_CATEGORIES_DELETE_SUCCESS": {
      const categoryId = _.get(action, "record.id");
      const copiedState = mutableCopy(state.organizationFacts);
      const organizationContainersToModify = _.remove<any>(copiedState, (o) =>
        _collections.some(o.children, categoryId, "category_id")
      );
      const modifiedOrganizationContainers = _.map(
        organizationContainersToModify,
        (o) => {
          const copiedChildren = mutableCopy(o.children);
          const childrenToModify = _.remove<any>(copiedChildren, (f) =>
            typeSafeEq(_.get(f, "category_id"), categoryId)
          );
          return {
            ...o,
            children: [
              ...copiedChildren,
              ..._.map(childrenToModify, (c) => ({ ...c, category_id: null })),
            ],
          };
        }
      );
      return {
        ...state,
        organizationFacts: [...copiedState, ...modifiedOrganizationContainers],
      };
    }
    case "SPACES_DELETE_SUCCESS": {
      const spaceId = _.get(action, "record.id");
      const copiedState = mutableCopy(state.organizationFacts);
      const organizationContainersToModify = _.remove<any>(copiedState, (o) =>
        _collections.some(o.children, spaceId, "exported_from_id")
      );
      const modifiedOrganizationContainers = _.map(
        organizationContainersToModify,
        (o) => ({
          ...o,
          children: _.filter(
            o.children,
            (f) => !typeSafeEq(_.get(f, "exported_from_id"), spaceId)
          ),
        })
      );

      return {
        ...state,
        organizationFacts: [...copiedState, ...modifiedOrganizationContainers],
      };
    }
    default:
      return state;
  }
};
